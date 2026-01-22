import { NextResponse } from 'next/server'

const MAILERLITE_API_KEY = process.env.MAILERLITE_API_KEY
const WAITLIST_GROUP_ID = '177237166380812033'
const NEWSLETTER_GROUP_ID = '177319791881618855'

export async function POST(request: Request) {
  const { email, experience, newsletter } = await request.json()

  if (!MAILERLITE_API_KEY) {
    console.error('MailerLite API key not configured')
    return NextResponse.json({ success: false, error: 'server_error' }, { status: 500 })
  }

  // Build groups array: always include waitlist, add newsletter if opted in
  const groups = [WAITLIST_GROUP_ID]
  if (newsletter) {
    groups.push(NEWSLETTER_GROUP_ID)
  }

  // Build fields object - only include experience if provided
  const fields: Record<string, string> = {}
  if (experience) {
    fields.experience = experience
  }

  const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${MAILERLITE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      groups,
      ...(Object.keys(fields).length > 0 && { fields })
    })
  })

  const data = await response.json()

  // MailerLite returns 422 with error for existing subscribers
  if (response.status === 422 && data.message?.includes('already')) {
    return NextResponse.json({ success: false, error: 'duplicate' }, { status: 409 })
  }

  if (!response.ok) {
    console.error('MailerLite API error:', data)
    return NextResponse.json({ success: false, error: 'server_error' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
