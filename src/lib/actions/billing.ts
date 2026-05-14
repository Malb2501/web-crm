'use server'

import { redirect } from 'next/navigation'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { getActiveWorkspaceId } from '@/lib/data/workspaces'
import { stripe, STRIPE_PRO_PRICE_ID } from '@/lib/stripe'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL!

export async function createCheckoutSession(): Promise<never> {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const workspaceId = await getActiveWorkspaceId()
  if (!workspaceId) redirect('/onboarding')

  const { data: sub } = await supabase
    .from('subscriptions')
    .select('stripe_customer_id, plan')
    .eq('workspace_id', workspaceId)
    .single()

  if (sub?.plan === 'pro') redirect('/settings/billing')

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    customer: sub?.stripe_customer_id ?? undefined,
    customer_email: sub?.stripe_customer_id ? undefined : user.email,
    line_items: [{ price: STRIPE_PRO_PRICE_ID, quantity: 1 }],
    metadata: { workspace_id: workspaceId },
    success_url: `${APP_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${APP_URL}/payment/cancel`,
  })

  redirect(session.url!)
}

export async function createPortalSession(): Promise<never> {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const workspaceId = await getActiveWorkspaceId()
  if (!workspaceId) redirect('/onboarding')

  const { data: sub } = await supabase
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('workspace_id', workspaceId)
    .single()

  if (!sub?.stripe_customer_id) redirect('/settings/billing')

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: sub.stripe_customer_id,
    return_url: `${APP_URL}/settings/billing`,
  })

  redirect(portalSession.url)
}
