import AdminLayout from "./AdminLayout";
import AwsCostDashboard from "./AwsCostDashboard";
import GithubContributions from "./GithubContributions";

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <AwsCostDashboard />
      <GithubContributions />
    </AdminLayout>
  );
}
