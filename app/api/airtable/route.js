import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

/* ============================================================
   Airtable API Route — Secured with Service Role

   Security model:
   1. Validates the user is authenticated (anon key + session)
   2. Reads airtable_connections using service role (bypasses RLS)
   3. Calls Airtable server-side — token never reaches browser
   4. Returns only records to the browser
   5. Handles Airtable pagination automatically (all pages)

   Query params:
     app    — matches airtable_connections.app (e.g. 'interface-project-progress')
     table  — the Airtable table name to query
     view   — (optional) Airtable view name
     filter — (optional) Airtable filterByFormula string
   ============================================================ */
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const appName   = searchParams.get('app')
  const tableName = searchParams.get('table')
  const viewName  = searchParams.get('view')
  const filter    = searchParams.get('filter')

  if (!appName || !tableName) {
    return Response.json({ error: 'Missing required params: app, table' }, { status: 400 })
  }

  /* --- Step 1: Validate the user is authenticated --- */
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  /* --- Step 2: Read airtable_connections using service role --- */
  const admin = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  const { data: conn, error: connError } = await admin
    .from('airtable_connections')
    .select('token, base_id')
    .eq('app', appName)
    .single()

  if (connError || !conn) {
    return Response.json({ error: 'Airtable credentials not found' }, { status: 404 })
  }

  /* --- Step 3: Call Airtable with pagination — token never leaves the server --- */
  const allRecords = []
  let offset = undefined

  do {
    const url = new URL(`https://api.airtable.com/v0/${conn.base_id}/${encodeURIComponent(tableName)}`)
    url.searchParams.set('pageSize', '100')
    if (viewName) url.searchParams.set('view', viewName)
    if (filter)   url.searchParams.set('filterByFormula', filter)
    if (offset)   url.searchParams.set('offset', offset)

    const airtableRes = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${conn.token}` },
    })

    if (!airtableRes.ok) {
      return Response.json({ error: 'Airtable request failed' }, { status: airtableRes.status })
    }

    const data = await airtableRes.json()
    allRecords.push(...(data.records ?? []))
    offset = data.offset
  } while (offset)

  return Response.json(allRecords)
}
