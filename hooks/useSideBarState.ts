import { useSidebar } from '@/components/ui/sidebar';

export default function useSideBarState() {
  const { state, open, setOpen, openMobile, setOpenMobile, isMobile, toggleSidebar } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return {
    isSidebarCollapsed: isCollapsed,
    open,
    setOpen,
    openMobile,
    setOpenMobile,
    isMobile,
    toggleSidebar,
  };
}
