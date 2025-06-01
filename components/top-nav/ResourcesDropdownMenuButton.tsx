import { Info, ExternalLink } from 'lucide-react';

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
import { DropdownMenuItem, DropdownMenuShortcut } from '../ui/dropdown-menu';

export default function ResourcesDropdownMenuButton() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Info />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="" align="end">
        <DropdownMenuLabel>Resources</DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem>
            <a
              href={ `https://google.com` }
              target="_blank"
              rel="noreferrer"
              className="flex w-full flex-row items-center justify-start gap-x-1"
            >
              <ExternalLink />
              <CenterUnderline label="Documentation" className="" />
              <DropdownMenuShortcut className="ml-2">⇧D</DropdownMenuShortcut>
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <a
              href={ `https://google.com` }
              target="_blank"
              rel="noreferrer"
              className="flex w-full flex-row items-center justify-start gap-x-1"
            >
              <ExternalLink />
              <CenterUnderline label="Support Room" className="" />
              <DropdownMenuShortcut className="ml-2">⇧R</DropdownMenuShortcut>
            </a>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
