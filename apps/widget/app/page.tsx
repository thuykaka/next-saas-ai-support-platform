import { UserListView } from "@/modules/users/ui/components/user-list-view"

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Apps/Widget</h1>
        <UserListView />
      </div>
    </div>
  )
}
