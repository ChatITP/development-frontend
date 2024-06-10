import * as React from "react";
import axios from "axios";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  PaginationState,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { DataTablePagination } from "@/components/ui/data-table-pagination"; // Adjust the import path as necessary

interface User {
  _id: string;
  designated: number;
  user_name: string;
}

interface Project {
  id: string;
  project_id: string; 
  project_name: string;
  instructor: string;
  year: number;
  medium: string;
  users: User[];
  keywords: string;
  audience: string;
  elevator_pitch: string;
  description: string;
  background: string;
  user_scenario: string;
  technical_system: string;
  url: string;
  video: string;
  public_video_url: string;
  conclusion: string;
  project_references: string;
  thesis: string;
  timestamp: string;
  personal_statement: string;
  sustain: string;
  thesis_slides: string;
  thesis_tags: string;
  image: string;
  image_alt: string;
  documents: any[];
  classes: any[];
  instructors: any[];
}


export function DataTable() {
  const [data, setData] = React.useState<Project[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pagination, setPagination] = React.useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [pageCount, setPageCount] = React.useState(0);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [currentProject, setCurrentProject] = React.useState<Project | null>(null);

  const handleViewDetails = (project: Project) => {
    setCurrentProject(project);
    setIsDialogOpen(true);
  };

  const columns: ColumnDef<Project>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "project_id",
      header: "ID",
    },
    {
      accessorKey: "users",
      header: "Artists",
      cell: ({ getValue }) => {
        const users = getValue<User[]>();
        return (
          <div>
            {users.map((user) => user.user_name).join(", ")}
          </div>
        );
      },
    },    
    {
      accessorKey: "project_name",
      header: "Project Name",
    },
    {
      accessorKey: "keywords",
      header: "Keywords",
    },
    {
      accessorKey: "year",
      header: "Year",
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const project = row.original;
  
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(project.project_id)}
              >
                Copy project ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleViewDetails(project)}>View details</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const fetchProjects = async (pageIndex: number, pageSize: number) => {
    try {
      const offset = pageIndex * pageSize;
      const response = await axios.get(`http://localhost:3001/db/getPaginated?limit=${pageSize}&offset=${offset}`);
      const countResponse = await axios.get("http://localhost:3001/db/projectCount");
      const projects = response.data.map((project: Project) => ({
        ...project,
        user_name: project.users[0]?.user_name || 'N/A',
        year: new Date(project.timestamp).getFullYear(),
      }));
      setData(projects);
      setPageCount(Math.ceil(countResponse.data.count / pageSize));
      setLoading(false);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError(error);
      } else {
        setError(new Error("An unexpected error occurred"));
      }
      setLoading(false);
    }
  };

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
    pageCount,
    manualPagination: true,
    onPaginationChange: setPagination,
  });

  React.useEffect(() => {
    fetchProjects(pagination.pageIndex, pagination.pageSize);
  }, [pagination.pageIndex, pagination.pageSize]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading data: {error.message}</div>;
  }

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter by project name..."
          value={(table.getColumn("project_name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("project_name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination table={table} />
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-screen my-6 overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Project Details</DialogTitle>
          </DialogHeader>
          <DialogDescription>
          </DialogDescription>
          {currentProject ? (
              <div className="space-y-4">
                <p><strong>ID:</strong> {currentProject.project_id}</p>
                <p><strong>Project Name:</strong> {currentProject.project_name}</p>
                <p><strong>Artists:</strong> {currentProject.users.map(user => user.user_name).join(", ")}</p>
                <p><strong>Audience:</strong> {currentProject.audience}</p>
                <p><strong>Elevator Pitch:</strong> {currentProject.elevator_pitch}</p>
                <p><strong>Description:</strong> {currentProject.description}</p>
                <p><strong>Background:</strong> {currentProject.background}</p>
                <p><strong>User Scenario:</strong> {currentProject.user_scenario}</p>
                <p><strong>Technical System:</strong> {currentProject.technical_system}</p>
                <p><strong>URL:</strong> <a href={currentProject.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">{currentProject.url}</a></p>
                <p><strong>Keywords:</strong> {currentProject.keywords}</p>
                <p><strong>Project References:</strong> {currentProject.project_references}</p>
                <p><strong>Timestamp:</strong> {currentProject.timestamp}</p>
                <p><strong>Personal Statement:</strong> {currentProject.personal_statement}</p>
                <p><strong>Sustain:</strong> {currentProject.sustain}</p>
              </div>
            ) : (
              <p>Loading...</p>
            )}
          <DialogFooter>
            <DialogClose asChild>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default DataTable;
