'use client';

import { Activity, useState } from 'react';
import { Dot, Folder, ChevronUp, FolderOpen, ChevronDown, ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import RowStack from '@/shared/components/RowStack';
import ColumnStack from '@/shared/components/ColumnStack';
import DisplayCard from '@/shared/components/DisplayCard';
import Typography from '@/components/typography/Typography';
import LayoutWithGutter from '@/components/layout/LayoutWithGutter';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  Sidebar,
  SidebarMenu,
  SidebarGroup,
  SidebarContent,
  SidebarMenuSub,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSubItem,
  SidebarGroupContent,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar';

/**
 *
 * Hierarchy:
 *
 * SidebarContent
 *   SidebarGroup   < - directive
 *     SidebarGroupContent
 *       SidebarMenu   < - In this section, show each key value in column stack
 *         Collapsible
 *           SidebarMenuItem
 *              CollapsibleTrigger
 *                SidebarMenuSub  < -- more key values
 *                   Collapsible
 *                     SidebarMenuSubItem
 *                       SidebarMenuSub
 *
 *
 *
 *
 *
 *
 *
 *   SidebarGroup < - directive
 *     SidebarGroupContent
 *       SidebarMenu
 *
 *
 *
 *
 *
 *
 *
 *
 */
export default function NestedRequests() {
  return (
    <ColumnStack className="w-full">
      <LayoutWithGutter size="med">
        <DisplayCard className="">
          <SidebarContent>
            <RequestsParent reqs={ mockData } />
          </SidebarContent>
        </DisplayCard>
      </LayoutWithGutter>
    </ColumnStack>
  );
}

function RequestsParent({ reqs }: { reqs: MockRequest[] }) {
  return (
    <>
      { reqs.map((req: MockRequest, index, arr) => {
        return <NestedRequest req={ req } index={ index } totalCount={ arr.length } key={ req.request_id } />;
      }) }
    </>
  );
}

function NestedRequest({ req, index, totalCount }: { req: MockRequest; index: number; totalCount: number }) {
  const [isShown, setIsShown] = useState(true);

  const handleOnClickAction = () => {
    setIsShown(!isShown);
  };

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <RequestHeader isShown={ isShown } req={ req } index={ index } totalCount={ totalCount } onAction={ handleOnClickAction } />
        <SidebarMenu className="mt-2 pl-4">
          { isShown ?
            <>
              <RowStack className="items-center gap-x-2">
                <Typography>Request ID:</Typography>
                <Typography>{ req.request_id }</Typography>
              </RowStack>
              <RowStack className="items-center gap-x-2">
                <Typography>Status ID:</Typography>
                <Typography>{ req.status }</Typography>
              </RowStack>
              <RowStack className="items-center gap-x-2">
                <Typography>Redacted:</Typography>
                <Typography>{ req.redacted ? 'Redacted' : 'Not Redacted' }</Typography>
              </RowStack>
              <RowStack className="items-center gap-x-2">
                <Typography>Created At:</Typography>
                <Typography>{ req.created_at }</Typography>
              </RowStack>

              <ResourcesParent resources={ req.works } />

              <WorksParent works={ req.works } />
            </>
          : null }
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

function RequestHeader({
  req,
  index,
  totalCount,
  onAction,
  isShown,
}: {
  req: MockRequest;
  index: number;
  totalCount: number;
  onAction: VoidFunction;
  isShown: boolean;
}) {
  return (
    <RowStack className="items-center justify-between rounded-2xl border border-border bg-accent/40 p-3">
      <Typography className="flex flex-row items-center">
        Request { index + 1 }/{ totalCount } - { req.status } <Dot className="siz-4" /> { req.request_id }
      </Typography>
      <Button onClick={ onAction } variant="ghost" size="icon-sm">
        { isShown ?
          <ChevronUp />
        : <ChevronDown /> }
      </Button>
    </RowStack>
  );
}

function ResourcesParent({ resources }: { resources: MockWork[] }) {
  const [isOpen, setIsOpen] = useState(true);

  const handleOnOpenChange = () => {
    setIsOpen(!isOpen);
  };
  return (
    <Collapsible asChild className="" open={ isOpen } onOpenChange={ handleOnOpenChange }>
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton onClick={ handleOnOpenChange }>
            { isOpen ?
              <FolderOpen className="stroke-primary" />
            : <Folder className="stroke-primary" /> }
            <span>Resources (no Activity) ({ resources.length }):</span>
            <ChevronRight className={ cn('ml-auto stroke-primary transition-transform duration-200', isOpen && 'rotate-90') } />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <WorkNameInput />
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}

function WorksParent({ works }: { works: MockWork[] }) {
  return (
    <>
      <RowStack className="items-center gap-x-2">
        <Typography>Works (with Activity) ({ works.length }):</Typography>
      </RowStack>
      { works.map((work: MockWork, index, arr) => {
        return <WorkDisplay work={ work } index={ index } totalCount={ arr.length } key={ work.work_id } />;
      }) }
    </>
  );
}

function WorkDisplay({ work, totalCount, index }: { work: MockWork; totalCount: number; index: number }) {
  const [isOpen, setIsOpen] = useState(true);

  const handleOnOpenChange = () => {
    setIsOpen(!isOpen);
  };

  return (
    <SidebarMenuItem>
      <SidebarMenuButton onClick={ handleOnOpenChange }>
        { isOpen ?
          <FolderOpen className="stroke-primary" />
        : <Folder className="stroke-primary" /> }
        <span>
          Work ({ index + 1 }/{ totalCount })
        </span>
        <ChevronRight className={ cn('ml-auto stroke-primary transition-transform duration-200', isOpen && 'rotate-90') } />
      </SidebarMenuButton>
      <Activity mode={ isOpen ? 'visible' : 'hidden' }>
        <SidebarMenuSub>
          <WorkNameInput />
          <RowStack className="items-center gap-x-2">
            <Typography>Work ID:</Typography>
            <Typography>{ work.work_id }</Typography>
          </RowStack>
          <RowStack className="items-center gap-x-2">
            <Typography>Work Name:</Typography>
            <Typography>{ work.work_name }</Typography>
          </RowStack>
          <RowStack className="items-center gap-x-2">
            <Typography>Work Status:</Typography>
            <Typography>{ work.work_status }</Typography>
          </RowStack>
          <ColumnStack>
            <Typography>Work Status:</Typography>
            <ColumnStack className="pl-4">
              <Typography>--hash: 1111:</Typography>
            </ColumnStack>
          </ColumnStack>
          <RowStack className="items-center gap-x-2">
            <Typography>Work Created At:</Typography>
            <Typography>{ work.work_created_at }</Typography>
          </RowStack>
          <RowStack className="items-center gap-x-2">
            <Typography>Work Updated At:</Typography>
            <Typography>{ work.work_updated_at }</Typography>
          </RowStack>

          <NodesParent datas={ work.nodes } />
        </SidebarMenuSub>
      </Activity>
    </SidebarMenuItem>
  );
}

function WorkNameInput() {
  const [name, setName] = useState('');
  return (
    <RowStack className="items-center gap-x-2">
      <Typography>Work Name:</Typography>
      <Input type="text" onChange={ (e) => setName(e.target.value) } value={ name } />
    </RowStack>
  );
}

function NodesParent({ datas }: { datas: MockNode[] }) {
  return (
    <>
      <RowStack className="items-center gap-x-2">
        <Typography>Nodes ({ datas.length }):</Typography>
      </RowStack>
      { datas.map((data: MockNode, index, arr) => {
        return <NodeDisplay node={ data } index={ index } totalCount={ arr.length } key={ data.node_id } />;
      }) }
    </>
  );
}

function NodeDisplay({ node, totalCount, index }: { node: MockNode; totalCount: number; index: number }) {
  const [isOpen, setIsOpen] = useState(true);

  const handleOnOpenChange = () => {
    setIsOpen(!isOpen);
  };

  return (
    <SidebarMenuSubItem>
      <SidebarMenuSubButton asChild>
        <Button type="button" className="w-full" variant="ghost" onClick={ handleOnOpenChange }>
          { isOpen ?
            <FolderOpen className="stroke-primary" />
          : <Folder className="stroke-primary" /> }
          <span>
            Node ({ index + 1 }/{ totalCount })
          </span>

          <ChevronRight className={ cn('ml-auto stroke-primary transition-transform duration-200', isOpen && 'rotate-90') } />
        </Button>
      </SidebarMenuSubButton>
      <Activity mode={ isOpen ? 'visible' : 'hidden' }>
        <SidebarMenuSub>
          <RowStack className="items-center gap-x-2">
            <Typography>Node ID:</Typography>
            <Typography>{ node.node_id }</Typography>
          </RowStack>
          <RowStack className="items-center gap-x-2">
            <Typography>Node Name:</Typography>
            <Typography>{ node.node_name }</Typography>
          </RowStack>
          <RowStack className="items-center gap-x-2">
            <Typography>Node Status:</Typography>
            <Typography>{ node.node_status }</Typography>
          </RowStack>
          <ColumnStack>
            <Typography>Node Status:</Typography>
            <ColumnStack className="pl-4">
              <Typography>--hash: 1111:</Typography>
            </ColumnStack>
          </ColumnStack>
          <RowStack className="items-center gap-x-2">
            <Typography>Node Created At:</Typography>
            <Typography>{ node.node_created_at }</Typography>
          </RowStack>
          <RowStack className="items-center gap-x-2">
            <Typography>Node Updated At:</Typography>
            <Typography>{ node.node_updated_at }</Typography>
          </RowStack>
        </SidebarMenuSub>
      </Activity>
    </SidebarMenuSubItem>
  );
}

const mockData: MockRequest[] = [
  {
    request_id: '1123-1234-1234-1234',
    initial_request_id: '1123-1234-1234-1234',
    status: 'active',
    redacted: false,
    created_at: '2021-01-01',
    updated_at: '2021-01-01',
    issuer: 'John Doe',
    works: [
      {
        work_id: '4233-4234-4234-4234',
        work_name: 'Super CPU Alaska',
        work_status: 'pending',
        work_created_at: '2021-01-01',
        work_updated_at: '2021-01-01',
        nodes: [
          {
            node_id: '1324-1234-1234-1234',
            node_type: 'node',
            node_name: 'Super CPU Alaska - Node 1',
            node_status: 'pending',
            node_created_at: '2021-01-01',
            node_updated_at: '2021-01-01',
          },
          {
            node_id: '5432-5432-5432-5432',
            node_type: 'node',
            node_name: 'Super CPU Alaska - Node 2',
            node_status: 'pending',
            node_created_at: '2021-01-01',
            node_updated_at: '2021-01-01',
          },
        ],
      },
      {
        work_id: '7654-7654-7654-7654',
        work_name: 'Graphics Calculations - Georgia',
        work_status: 'completed',
        work_created_at: '2021-01-01',
        work_updated_at: '2021-01-01',
        nodes: [
          {
            node_id: '9876-9876-9876-9876',
            node_type: 'node',
            node_name: 'Graphics Calculations - Georgia - Node 1',
            node_status: 'pending',
            node_created_at: '2021-01-01',
            node_updated_at: '2021-01-01',
          },
        ],
      },
    ],
    networks: [
      {
        network_id: '1234-1234-1234-1234',
        network_name: 'Alaska Network 1',
        network_status: 'active',
        network_created_at: '2021-01-01',
        network_updated_at: '2021-01-01',
        cards: [
          {
            card_id: '1234-1234-1234-1234',
            card_name: 'Alaska Network 1 - Card 1',
            card_status: 'pending',
            card_created_at: '2021-01-01',
            card_updated_at: '2021-01-01',
          },
          {
            card_id: '2',
            card_name: 'Alaska Network 1 - Card 2',
            card_status: 'pending',
            card_created_at: '2021-01-01',
            card_updated_at: '2021-01-01',
          },
        ],
      },
    ],
  },
  {
    request_id: '2',
    initial_request_id: '2',
    status: 'pending',
    redacted: false,
    created_at: '2021-01-01',
    updated_at: '2021-01-01',
    issuer: 'Jane Doe',
    works: [],
    networks: [],
  },
];

type MockRequest = {
  request_id: string;
  initial_request_id: string;
  status: string;
  redacted: boolean;
  created_at: string;
  updated_at: string;
  issuer: string;

  works: MockWork[];

  networks: MockNetwork[];
};

type MockWork = {
  work_id: string;
  work_name: string;
  work_status: string;
  work_created_at: string;
  work_updated_at: string;
  nodes: MockNode[];
};

type MockNode = {
  node_id: string;
  node_type: string;
  node_name: string;
  node_status: string;
  node_created_at: string;
  node_updated_at: string;
};

type MockNetwork = {
  network_id: string;
  network_name: string;
  network_status: string;
  network_created_at: string;
  network_updated_at: string;

  cards: MockCard[];
};

type MockCard = {
  card_id: string;
  card_name: string;
  card_status: string;
  card_created_at: string;
  card_updated_at: string;
};
