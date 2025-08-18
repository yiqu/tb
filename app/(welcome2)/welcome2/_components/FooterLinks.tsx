import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';

import { geistFont } from '@/lib/fonts-config';
import Typography from '@/components/typography/Typography';
import CenterUnderline from '@/fancy/components/text/underline-center';

export default function FooterLinks() {
  return (
    <div className={ `
      container mx-auto mt-20 mb-20 max-w-7xl px-4
      md:px-6
      ${geistFont.className}
    ` }>
      <div className="my-10 grid grid-cols-6 gap-x-8">
        <div className="col-span-1 space-y-3">
          <div>
            <Typography className="text-lg font-bold">Resources</Typography>
          </div>
          <div>
            <Link
              href="https://confluence.kqpro.com"
              target="_blank"
              className={ `
                flex flex-row items-center justify-start text-gray-600
                dark:text-gray-400
              ` }
            >
              <CenterUnderline label="Confluence" className="" />
              <ExternalLink className="size-4" />
            </Link>
          </div>
          <div>
            <Typography>Confluence</Typography>
          </div>
          <div>
            <Typography>Confluence</Typography>
          </div>
        </div>

        <div className="col-span-1 space-y-3">
          <div>
            <Typography className="text-lg font-bold">Developers</Typography>
          </div>
          <div>
            <Typography>Documentation</Typography>
          </div>
          <div>
            <Typography>API</Typography>
          </div>
        </div>

        <div className="col-span-1 space-y-3">
          <div>
            <Typography className="text-lg font-bold">Team</Typography>
          </div>
          <div>
            <Typography>Confluence</Typography>
          </div>
          <div>
            <Typography>Confluence</Typography>
          </div>
          <div>
            <Typography>Confluence</Typography>
          </div>
        </div>
      </div>
      <div className="flex flex-row items-center justify-start gap-x-2">
        <Image src={ `/status/storage.png` } alt={ 'drinking' } width={ 20 } height={ 20 } className={ `` } />
        <Typography className="font-bold tracking-wide">{ 'KQPRO' }</Typography>
      </div>
    </div>
  );
}
