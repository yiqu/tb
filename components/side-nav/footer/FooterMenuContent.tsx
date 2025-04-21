import { Sparkles, Settings, UserRound } from 'lucide-react';

import {
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

import FooterAvatarLogo from './FooterAvatarLogo';
import FooterAvatarText from './FooterAvatarText';
import ReauthButton from './footer-menu/ReauthButton';
import FooterMenuContentWrapper from './FooterMenuContentWrapper';

export default function FooterMenuContent() {
  return (
    <FooterMenuContentWrapper>
      <DropdownMenuLabel className="p-0 font-normal">
        <div className={ `flex items-center gap-2 px-1 py-1.5` }>
          <FooterAvatarLogo />
          <FooterAvatarText />
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />

      <DropdownMenuGroup>
        <DropdownMenuItem>
          <Settings />
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem>
          <UserRound />
          Account
        </DropdownMenuItem>

        <DropdownMenuItem>
          <Sparkles />
          Changelog
        </DropdownMenuItem>
      </DropdownMenuGroup>

      <DropdownMenuSeparator />

      <ReauthButton />
    </FooterMenuContentWrapper>
  );
}
