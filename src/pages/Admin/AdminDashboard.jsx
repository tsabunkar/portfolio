import AdminLayout from "./AdminLayout";
import AwsCostDashboard from "./AwsCostDashboard";
import GithubContributions from "./GithubContributions";
import YouTubeMetrics from "./YouTubeMetrics";

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <AwsCostDashboard />
      <YouTubeMetrics />
      <GithubContributions />
    </AdminLayout>
  );
}
