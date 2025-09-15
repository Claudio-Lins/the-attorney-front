import { getTranslations } from 'next-intl/server';

export default async function PathnamesPage() {
  const t = await getTranslations('PathnamesPage');

  return (
    <div className="max-w-[460px]">
      <h1 className="text-3xl font-bold">{t('title')}</h1>
      <div className="mt-4" dangerouslySetInnerHTML={{__html: t('description')}} />
    </div>
  );
} 