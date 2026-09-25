import {
  useGetSetting,
  type ISettingInterface,
} from "@/api/setting/setting.api";
import Setting from "@/components/modules/setting/setting";

const SiteSettingPage = () => {
  let { data: siteSettingData } = useGetSetting();

  const setting = siteSettingData?.data;
  return (
    <section>
      <Setting data={setting as ISettingInterface}></Setting>
    </section>
  );
};

export default SiteSettingPage;
