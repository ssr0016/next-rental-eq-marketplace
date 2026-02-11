import InfoMessage from "@/components/functional/info-message";
import PageTitle from "@/components/ui/page-title";
import { getUserProfile } from "@/server-actions/users";
import ProfileInfo from "./_components/profile_info";

export default async function UserProfilePage() {
  const response = await getUserProfile()

  if (!response.success) {
    return <InfoMessage message={response.message} />
  }

  const user = response.data

  return (
    <div>
      <PageTitle title="Profile" />
      <ProfileInfo user={user} />
    </div>
  )
}
