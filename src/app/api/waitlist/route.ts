import { NextResponse } from 'next/server'

const MAILERLITE_API_KEY = process.env.MAILERLITE_API_KEY
const MAILERLITE_GROUP_ID = process.env.MAILERLITE_GROUP_ID

export async function POST(request: Request) {
  const { email, experience, newsletter } = await request.json()

  if (!MAILERLITE_API_KEY || !MAILERLITE_GROUP_ID) {
    console.error('MailerLite environment variables not configured')
    return NextResponse.json({ success: false, error: 'server_error' }, { status: 500 })
  }

  const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${MAILERLITE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      groups: [MAILERLITE_GROUP_ID],
      fields: {
        experience: experience,
        newsletter: newsletter ? 'yes' : 'no'
      }
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
