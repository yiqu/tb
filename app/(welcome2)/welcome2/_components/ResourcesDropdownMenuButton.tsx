import { VariantProps } from 'class-variance-authority';
import { ExternalLink, MessageCircleQuestion } from 'lucide-react';

import { Button, buttonVariants } from '@/components/ui/button';
import CenterUnderline from '@/fancy/components/text/underline-center';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

export default function ResourcesDropdownMenuButton({ ...btnProps }: React.ComponentProps<'button'> & VariantProps<typeof buttonVariants>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" { ...btnProps }>
          <MessageCircleQuestion />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-50" align="end">
        <DropdownMenuLabel>Resources</DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem asChild className="cursor-pointer">
            <a
              href={ `https://google.com` }
              target="_blank"
              rel="noreferrer"
              className="flex w-full flex-row items-center justify-between gap-x-1"
            >
              <CenterUnderline label="Documentation" className="" />
              <ExternalLink />
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="cursor-pointer">
            <a
              href={ `https://google.com` }
              target="_blank"
              rel="noreferrer"
              className="flex w-full flex-row items-center justify-between gap-x-1"
            >
              <CenterUnderline label="Discord" className="" />
              <ExternalLink />
            </a>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
