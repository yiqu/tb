import Link from 'next/link';
import { Info, Brush, Shield, Settings, UserRound, ScrollText, Presentation } from 'lucide-react';

import { DropdownMenuItem, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';

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
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href={ `/account/settings` } prefetch={ true }>
            <Settings />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href={ `/account` } prefetch={ true }>
            <UserRound />
            Account
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href={ `/art` } prefetch={ true }>
            <Brush />
            Art
          </Link>
        </DropdownMenuItem>
      </DropdownMenuGroup>


      <DropdownMenuGroup>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href={ `/changelog` } prefetch={ true }>
            <ScrollText />
            Changelog
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href={ `/page-info` } prefetch={ true }>
            <Info />
            Page Information
          </Link>
        </DropdownMenuItem>
      </DropdownMenuGroup>


      <DropdownMenuGroup>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href={ `/login` } prefetch={ true }>
            <Shield />
            Admin Panel
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href={ `/welcome` } prefetch={ true }>
            <Presentation />
            Welcome Page
          </Link>
        </DropdownMenuItem>
      </DropdownMenuGroup>

      <DropdownMenuSeparator />

      <ReauthButton />
    </FooterMenuContentWrapper>
  );
}
