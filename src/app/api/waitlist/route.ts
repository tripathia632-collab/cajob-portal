import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = supabaseUrl && serviceRoleKey ? createClient(supabaseUrl, serviceRoleKey) : null;

// Local in-memory / fallback store
let fallbackWaitlist: Array<{
  id: string;
  email: string;
  name: string;
  source: string;
  message: string;
  createdAt: string;
}> = [
  {
    id: 'lead-sample-1',
    email: 'rohit.ca2025@gmail.com',
    name: 'Rohit Verma',
    source: 'Courses Waitlist (Cohort 1)',
    message: 'Interested in Financial Modelling & Statutory Audit documentation',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'lead-sample-2',
    email: 'priya.sharma@kpmg.com',
    name: 'Priya Sharma',
    source: 'Vacancy Alerts Newsletter',
    message: 'Qualified CA looking for M&A and Deals advisory openings in Mumbai',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name = '', source = 'General Waitlist', message = '' } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const entryId = `lead-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newEntry = {
      id: entryId,
      email: cleanEmail,
      name: name.trim(),
      source: source.trim(),
      message: message.trim(),
      createdAt: new Date().toISOString(),
    };

    // 1. Try Supabase
    let dbSaved = false;
    if (supabase) {
      try {
        const { error } = await supabase.from('waitlists').insert({
          id: entryId,
          email: cleanEmail,
          name: name.trim(),
          source: source.trim(),
          message: message.trim(),
        });
        if (!error) {
          dbSaved = true;
        } else {
          console.warn('Supabase waitlist insert note:', error.message);
        }
      } catch (err) {
        console.warn('Supabase connection note:', err);
      }
    }

    // 2. Always keep in fallback cache so it is never lost
    fallbackWaitlist.unshift(newEntry);

    return NextResponse.json({
      success: true,
      message: 'Your details have been registered successfully.',
      dbSaved,
    });
  } catch (error) {
    console.error('Waitlist POST error:', error);
    return NextResponse.json({ error: 'Failed to process waitlist entry' }, { status: 500 });
  }
}

export async function GET() {
  try {
    // 1. If Supabase configured, try fetching live DB waitlists
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('waitlists')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          const mapped = data.map((d: any) => ({
            id: d.id,
            email: d.email,
            name: d.name || '',
            source: d.source || 'Waitlist',
            message: d.message || '',
            createdAt: d.created_at,
          }));

          // Merge unique entries with fallback
          const all = [...mapped];
          fallbackWaitlist.forEach((fb) => {
            if (!all.some((a) => a.id === fb.id || (a.email === fb.email && a.source === fb.source))) {
              all.push(fb);
            }
          });
          return NextResponse.json({ waitlists: all });
        }
      } catch (err) {
        // Fallback
      }
    }

    return NextResponse.json({ waitlists: fallbackWaitlist });
  } catch (error) {
    return NextResponse.json({ waitlists: fallbackWaitlist });
  }
}
