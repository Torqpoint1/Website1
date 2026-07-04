import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { db } from '../lib/supabase';
import { getSettings } from '../lib/money';
import { money, shortDate } from '../lib/format';
import type { Account, CompanySettings, Invoice, LineItem, Quote } from '../lib/types';
import PointLoader from '../components/PointLoader';

type Doc = (Quote | Invoice) & { account?: { name: string } | null };

export default function PrintDocument() {
  const { kind, id } = useParams<{ kind: 'quote' | 'invoice'; id: string }>();
  const [doc, setDoc] = useState<Doc | null>(null);
  const [account, setAccount] = useState<Account | null>(null);
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const table = kind === 'quote' ? 'quotes' : 'invoices';
        const { data, error: err } = await db()
          .from(table)
          .select('*')
          .eq('id', id!)
          .single();
        if (err) throw err;
        const [stg, acc] = await Promise.all([
          getSettings(),
          db().from('accounts').select('*').eq('id', data.account_id).single(),
        ]);
        setDoc(data as Doc);
        setSettings(stg);
        setAccount(acc.data as Account);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Could not load.');
      }
    })();
  }, [kind, id]);

  if (error) return <p className="p-6 text-sm text-forge">{error}</p>;
  if (!doc || !settings || !account) return <PointLoader label="Preparing document" />;

  const isInvoice = kind === 'invoice';
  const invoice = doc as Invoice;
  const items = doc.line_items as LineItem[];

  return (
    <div className="min-h-dvh bg-white text-graphite">
      {/* Screen-only toolbar */}
      <div className="flex items-center justify-between border-b border-line px-6 py-3 print:hidden">
        <Link
          to={`/money/${kind}s/${doc.id}`}
          className="label-caps text-slate hover:text-graphite"
        >
          ← Back to editor
        </Link>
        <button type="button" onClick={() => window.print()} className="btn-forge">
          Print or save as PDF
        </button>
      </div>

      <div className="mx-auto max-w-2xl px-8 py-12 print:max-w-none print:px-12 print:py-10">
        {/* Head */}
        <div className="flex items-start justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="font-display text-3xl font-bold tracking-tight">
              {settings.business_name}
            </span>
            <span className="point" aria-hidden />
          </div>
          <div className="text-right">
            <p className="label-caps text-slate">{isInvoice ? 'Invoice' : 'Quote'}</p>
            <p className="font-display text-xl font-semibold">{doc.number}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 pt-12">
          <div>
            <p className="label-caps pb-1.5 text-slate">For</p>
            <p className="font-semibold">{account.name}</p>
            {account.primary_contact_name && (
              <p className="text-sm">{account.primary_contact_name}</p>
            )}
            {account.location && <p className="text-sm">{account.location}</p>}
          </div>
          <div className="text-right">
            <p className="label-caps pb-1.5 text-slate">From</p>
            <p className="font-semibold">{settings.business_name}</p>
            {settings.address && (
              <p className="whitespace-pre-line text-sm">{settings.address}</p>
            )}
            {settings.vat_registered && settings.vat_number && (
              <p className="text-sm">VAT {settings.vat_number}</p>
            )}
          </div>
        </div>

        <div className="flex gap-10 pt-8 text-sm">
          {isInvoice ? (
            <>
              <span>
                <span className="label-caps block text-slate">Issued</span>
                {shortDate(invoice.issue_date)}
              </span>
              <span>
                <span className="label-caps block text-slate">Due</span>
                {shortDate(invoice.due_date)}
              </span>
              {invoice.status === 'paid' && (
                <span>
                  <span className="label-caps block text-slate">Paid</span>
                  {shortDate(invoice.paid_date)}
                </span>
              )}
            </>
          ) : (
            <span>
              <span className="label-caps block text-slate">Date</span>
              {shortDate((doc as Quote).sent_date ?? doc.created_at)}
            </span>
          )}
        </div>

        {/* Lines */}
        <table className="mt-10 w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-graphite text-left">
              <th className="label-caps pb-2 font-semibold text-slate">Description</th>
              <th className="label-caps pb-2 text-right font-semibold text-slate">Qty</th>
              <th className="label-caps pb-2 text-right font-semibold text-slate">Unit</th>
              <th className="label-caps pb-2 text-right font-semibold text-slate">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i} className="border-b border-line">
                <td className="py-3 pr-4 text-sm">{item.description}</td>
                <td className="py-3 text-right text-sm">{item.qty}</td>
                <td className="py-3 text-right text-sm">{money(item.unit_price)}</td>
                <td className="py-3 text-right text-sm font-semibold">
                  {money(item.line_total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="ml-auto mt-6 max-w-56">
          <div className="flex justify-between py-1 text-sm">
            <span className="text-slate">Subtotal</span>
            <span>{money(Number(doc.subtotal))}</span>
          </div>
          {Number(doc.vat_amount) > 0 && (
            <div className="flex justify-between py-1 text-sm">
              <span className="text-slate">VAT</span>
              <span>{money(Number(doc.vat_amount))}</span>
            </div>
          )}
          <div className="mt-1 flex items-baseline justify-between border-t-2 border-graphite pt-2">
            <span className="label-caps text-slate">
              {isInvoice ? 'Total due' : 'Total'}
            </span>
            <span className="font-editorial text-3xl">{money(Number(doc.total))}</span>
          </div>
        </div>

        {/* Payment block */}
        {isInvoice && (settings.bank_details || settings.payment_link) && (
          <div className="mt-12 border border-line bg-paper p-5 print:bg-white">
            <p className="label-caps pb-2 text-slate">Payment</p>
            {settings.bank_details && (
              <p className="whitespace-pre-line text-sm">{settings.bank_details}</p>
            )}
            {settings.payment_link && (
              <p className="pt-1 text-sm">
                Pay online: <span className="font-semibold">{settings.payment_link}</span>
              </p>
            )}
            <p className="pt-2 text-sm text-slate">{settings.payment_terms}</p>
          </div>
        )}
        {!isInvoice && (
          <p className="mt-12 text-sm text-slate">
            Quoted up front, no lock-in. Accept and we'll get started.
          </p>
        )}

        {/* Foot */}
        <div className="mt-16 flex items-center justify-between border-t border-line pt-4">
          <span className="text-xs text-slate">
            {settings.business_name} · Gloucestershire
          </span>
          <span className="point" aria-hidden />
        </div>
      </div>
    </div>
  );
}
