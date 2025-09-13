import { ExternalLink, MessageCircleQuestion } from 'lucide-react';

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
      <DropdownMenuContent className="min-w-50" align="end" sideOffset={ 16 }>
        <DropdownMenuLabel>Resources</DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem asChild className="cursor-pointer">
            <a
              href={ `https://google.com` }
              target="_blank"
              rel="noreferrer"
              className="external flex w-full flex-row items-center justify-between gap-x-1"
            >
              Documentation
              <ExternalLink />
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="cursor-pointer">
            <a
              href={ `https://google.com` }
              target="_blank"
              rel="noreferrer"
              className="external flex w-full flex-row items-center justify-between gap-x-1"
            >
              Discord
              <ExternalLink />
            </a>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
