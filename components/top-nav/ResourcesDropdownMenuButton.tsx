import { ExternalLink, MessageCircleQuestion } from 'lucide-react';

import CenterUnderline from '@/fancy/components/text/underline-center';
import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

import { Button } from '../ui/button';
import { DropdownMenuItem } from '../ui/dropdown-menu';

export default function ResourcesDropdownMenuButton() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
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
