import {
  useUpdateSetting,
  type ISettingInterface,
} from "@/api/setting/setting.api";
import PhonesInput from "@/components/custom/phone-input";
import StatusModal, { modalState } from "@/components/custom/status-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useAdminPermission } from "@/helper/use-admin-permission";
import { Truck, UploadCloud } from "lucide-react";
import { lazy, Suspense, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
const LazyTiptapEditor = lazy(
  () => import("@/components/editor/tip-tap/tip-tap-lazy"),
);

interface SettingProps {
  data?: ISettingInterface;
}

const Setting = ({ data }: SettingProps) => {
  const [modal, setModal] = useState(modalState);
  const { mutateAsync: updateSettings, isPending } = useUpdateSetting();
  const [aboutEditor, setAboutEditor] = useState<any>(null);
  const [refundEditor, setRefundEditor] = useState<any>(null);
  const [cancelEditor, setCancelEditor] = useState<any>(null);
  const [privacyEditor, setPrivacyEditor] = useState<any>(null);
  const [laundryNoteEditor, setLaundryNoteEditor] = useState<any>(null);
  const [termsEditor, setTermsEditor] = useState<any>(null);

  const [preview, setPreview] = useState({
    logo: data?.logo || "",
    favicon: data?.favicon || "",
    card_one_logo: data?.card_one_logo || "",
    card_two_logo: data?.card_two_logo || "",
    card_three_logo: data?.card_three_logo || "",
    card_four_logo: data?.card_four_logo || "",
    card_five_logo: data?.card_four_logo || "",
    pay_with: data?.pay_with || "",
    card_one_banner: data?.card_one_banner || "",
    card_two_banner: data?.card_two_banner || "",
    card_three_banner: data?.card_three_banner || "",
    laundry_service_image: data?.laundry_service_image,
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: data || {},
  });

  const isShippingChargeOff = watch("is_shipping_charge_off");

  useEffect(() => {
    if (data) {
      reset(data);
    }
  }, [data, reset]);

  useEffect(() => {
    if (data) {
      setPreview({
        logo: data.logo || "",
        favicon: data.favicon || "",
        card_one_logo: data.card_one_logo || "",
        card_two_logo: data.card_two_logo || "",
        card_three_logo: data.card_three_logo || "",
        card_four_logo: data.card_four_logo || "",
        pay_with: data.pay_with || "",
        card_five_logo: data?.card_five_logo || "",
        card_one_banner: data?.card_one_banner || "",
        card_two_banner: data?.card_two_banner || "",
        card_three_banner: data?.card_three_banner || "",
        laundry_service_image: data?.laundry_service_image,
      });
      reset(data);
    }
  }, [data, reset]);

  useEffect(() => {
    if (!data) return;

    aboutEditor?.commands.setContent(data.about_us || "");
    refundEditor?.commands.setContent(data.refund_policy || "");
    cancelEditor?.commands.setContent(data.cancellation_policy || "");
    privacyEditor?.commands.setContent(data.privacy_policy || "");
    termsEditor?.commands.setContent(data.terms_condition || "");
    laundryNoteEditor?.commands.setContent(data.laundry_service_note || "");
  }, [
    data,
    aboutEditor,
    refundEditor,
    cancelEditor,
    privacyEditor,
    termsEditor,
    laundryNoteEditor,
  ]);

  useEffect(() => {
    if (data) {
      const formattedData = { ...data };

      if (formattedData.watsapp?.includes("wa.me")) {
        const number = formattedData.watsapp.replace(/\D/g, "");
        formattedData.watsapp = `+${number}`;
      }

      reset(formattedData);
    }
  }, [data, reset]);

  useEffect(() => {
    if (!modal.open) return;
    const timer = setTimeout(
      () => setModal((prev) => ({ ...prev, open: false })),
      8000,
    );
    return () => clearTimeout(timer);
  }, [modal.open]);

  const handleImageChange = (e: any, field: any) => {
    const file = e.target.files[0];
    if (!file) return;
    setValue(field, file);
    setPreview((prev) => ({ ...prev, [field]: URL.createObjectURL(file) }));
  };

  const onSubmit = async (formData: ISettingInterface) => {
    try {
      const payload = new FormData();
      if (formData.watsapp) {
        formData.watsapp = `https://wa.me/${formData.watsapp.replace(/\D/g, "")}`;
      }
      formData.about_us = aboutEditor?.getHTML() ?? "";
      formData.refund_policy = refundEditor?.getHTML() ?? "";
      formData.cancellation_policy = cancelEditor?.getHTML() ?? "";
      formData.privacy_policy = privacyEditor?.getHTML() ?? "";
      formData.terms_condition = termsEditor?.getHTML() ?? "";
      formData.laundry_service_note = laundryNoteEditor?.getHTML() ?? "";
      for (const key in formData) {
        const value = formData[key as keyof ISettingInterface];
        if (value instanceof File) {
          payload.append(key, value);
        } else {
          payload.append(key, value ?? "");
        }
      }

      await updateSettings(payload);

      setModal({
        open: true,
        status: "success",
        title: "Settings Updated",
        message: "Site settings updated successfully",
      });
    } catch (err: any) {
      setModal({
        open: true,
        status: "error",
        title: "Failed",
        message: err?.message || "Something went wrong. Please try again.",
      });
    }
  };

  type SocialField =
    | "facebook"
    | "instagram"
    | "twitter"
    | "you_tube"
    | "tik_tok";

  const cards = ["one", "two", "three", "four", "five"] as const;
  const cardBanner = ["one", "two", "three"] as const;
  const social: SocialField[] = [
    "facebook",
    "instagram",
    "twitter",
    "you_tube",
    "tik_tok",
  ];

  const { can } = useAdminPermission();

  return (
    <section className="">
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        Site Settings
      </h1>

      <form className="space-y-8">
        <Card className="p-6 rounded-lg border border-gray-200 shadow-sm">
          <CardContent className="space-y-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              Branding & Identity
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col space-y-1">
                <Label>Site Logo</Label>
                {preview.logo && (
                  <img
                    src={preview.logo}
                    className="h-20 lg:h-30 w-3/12 mb-2 rounded border"
                  />
                )}
                <Input
                  type="file"
                  onChange={(e) => handleImageChange(e, "logo")}
                />
              </div>

              <div className="flex flex-col space-y-1">
                <Label>Favicon</Label>
                {preview.favicon && (
                  <img
                    src={preview.favicon}
                    className="h-20 lg:h-30 w-3/12 mb-2 rounded border"
                  />
                )}
                <Input
                  type="file"
                  onChange={(e) => handleImageChange(e, "favicon")}
                />
              </div>

              <div className="flex flex-col space-y-1">
                <Label>Site Title</Label>
                <Input {...register("title")} placeholder="Site Title" />
              </div>
              <div className="space-y-2 -mt-1">
                <Label htmlFor="contact">Contact</Label>

                <Controller
                  control={control}
                  name="contact"
                  render={({ field }) => (
                    <PhonesInput
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.contact?.message}
                    />
                  )}
                />
              </div>

              <div className="flex flex-col space-y-1">
                <Label>Email</Label>
                <Input {...register("email")} placeholder="Email" />
              </div>
              <div className="flex flex-col space-y-1">
                <Label>Address</Label>
                <Input {...register("address")} placeholder="Address" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="p-6 rounded-lg border border-gray-200 shadow-sm">
          <CardContent className="space-y-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              Social Media Links
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {social.map((field) => (
                <div key={field} className="flex flex-col space-y-1">
                  <Label className="capitalize">
                    {field.replace("_", " ")}
                  </Label>
                  <Input
                    {...register(field)}
                    placeholder={`Enter ${field.replace("_", " ")}`}
                  />
                </div>
              ))}

              <div className="space-y-2 -mt-1">
                <Label htmlFor="watsapp">WhatsApp</Label>

                <Controller
                  control={control}
                  name="watsapp"
                  render={({ field }) => (
                    <PhonesInput
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.watsapp?.message}
                    />
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="p-6 rounded-lg border border-gray-200 shadow-sm">
          <CardContent className="space-y-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              Cards
            </h2>

            {cards.map((c) => (
              <Card
                className={"p-6 rounded-lg border border-gray-200 shadow-sm"}
              >
                <Label className="font-medium">
                  Card {c.charAt(0).toUpperCase() + c.slice(1)}
                </Label>
                <Card
                  key={c}
                  className="flex flex-col lg:flex-row items-start gap-6 mb-6 p-6 rounded-lg border border-gray-200 shadow-sm"
                >
                  <div className="flex flex-col space-y-2">
                    <Label className="font-medium">Logo</Label>
                    {preview[`card_${c}_logo` as keyof typeof preview] && (
                      <img
                        src={preview[`card_${c}_logo` as keyof typeof preview]}
                        className="h-40 md:h-56 w-auto rounded border"
                      />
                    )}
                    <Input
                      type="file"
                      onChange={(e) => handleImageChange(e, `card_${c}_logo`)}
                    />
                  </div>

                  <div className="flex-1 grid xl:grid-cols-1 gap-5 space-y-5">
                    <div className="flex flex-col space-y-1">
                      <Label>Title</Label>
                      <Textarea
                        {...register(`card_${c}_title` as const)}
                        placeholder={`Card ${c} Title`}
                      />
                    </div>
                  </div>
                </Card>
              </Card>
            ))}
          </CardContent>
        </Card>
        <Card className="p-6 rounded-lg border border-gray-200 shadow-sm">
          <CardContent className="space-y-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              Banner Card
            </h2>

            {cardBanner.map((c) => (
              <Card
                className={"p-6 rounded-lg border border-gray-200 shadow-sm"}
              >
                <Label className="font-medium">
                  Card {c.charAt(0).toUpperCase() + c.slice(1)}
                </Label>
                <Card
                  key={c}
                  className="flex flex-col lg:flex-row items-start gap-6 mb-6 p-6 rounded-lg border border-gray-200 shadow-sm"
                >
                  <div className="flex flex-col space-y-2">
                    <Label className="font-medium">Banner</Label>
                    {preview[`card_${c}_banner` as keyof typeof preview] && (
                      <img
                        src={
                          preview[`card_${c}_banner` as keyof typeof preview]
                        }
                        className="h-40 md:h-56 w-auto rounded border"
                      />
                    )}
                    <Input
                      type="file"
                      onChange={(e) => handleImageChange(e, `card_${c}_banner`)}
                    />
                  </div>

                  <div className="flex-1 grid xl:grid-cols-1 gap-5 space-y-5">
                    <div className="flex flex-col space-y-1">
                      <Label>Path</Label>
                      <Input
                        {...register(`card_${c}_path` as const)}
                        placeholder={`Card ${c} Path`}
                      />
                    </div>
                  </div>
                </Card>
              </Card>
            ))}
          </CardContent>
        </Card>

        <Card className="p-6 rounded-lg border border-gray-200 shadow-sm">
          <CardContent className="space-y-8">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              Policies
            </h2>

            <div className="flex flex-col gap-3">
              <Label>About Us</Label>
              <Suspense fallback={<div className="h-40 bg-gray-50" />}>
                <LazyTiptapEditor
                  placeholder="Write about us…"
                  onEditor={setAboutEditor}
                />
              </Suspense>
            </div>

            <div className="flex flex-col gap-3">
              <Label>Refund Policy</Label>
              <Suspense fallback={<div className="h-40 bg-gray-50" />}>
                <LazyTiptapEditor
                  placeholder="Write refund policy…"
                  onEditor={setRefundEditor}
                />
              </Suspense>
            </div>

            <div className="flex flex-col gap-3">
              <Label>Cancellation Policy</Label>
              <Suspense fallback={<div className="h-40 bg-gray-50" />}>
                <LazyTiptapEditor
                  placeholder="Write cancellation policy…"
                  onEditor={setCancelEditor}
                />
              </Suspense>
            </div>

            <div className="flex flex-col gap-3">
              <Label>Privacy Policy</Label>
              <Suspense fallback={<div className="h-40 bg-gray-50" />}>
                <LazyTiptapEditor
                  placeholder="Write privacy policy…"
                  onEditor={setPrivacyEditor}
                />
              </Suspense>
            </div>

            <div className="flex flex-col gap-3">
              <Label>Terms & Conditions</Label>
              <Suspense fallback={<div className="h-40 bg-gray-50" />}>
                <LazyTiptapEditor
                  placeholder="Write terms & conditions…"
                  onEditor={setTermsEditor}
                />
              </Suspense>
            </div>
          </CardContent>
        </Card>

        <Card className="p-6 rounded-lg border border-gray-200 shadow-sm">
          <CardContent className="space-y-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              Laundry Services
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col space-y-1">
                <Label>Laundry Services Images</Label>
                {preview.laundry_service_image && (
                  <img
                    src={preview.laundry_service_image}
                    className="h-40 md:h-56 w-1/2 mb-2 rounded border"
                  />
                )}
                <Input
                  type="file"
                  onChange={(e) =>
                    handleImageChange(e, "laundry_service_image")
                  }
                />
              </div>

              <div className="flex flex-col space-y-1">
                <Label>Laundry Service Note</Label>
                <Suspense fallback={<div className="h-40 bg-gray-50" />}>
                  <LazyTiptapEditor
                    placeholder="Write laundry note…"
                    onEditor={setLaundryNoteEditor}
                  />
                </Suspense>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-gray-200 shadow-sm bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">
              Delivery & Payment Settings
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* ================= Payment Section ================= */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-emerald-500" />
                <h3 className="text-sm font-medium text-gray-700">
                  Pay With (Payment Method Image)
                </h3>
              </div>

              <div className="flex flex-col lg:flex-row gap-4 items-start">
                {/* Image Preview */}
                <div className="w-full lg:w-1/4">
                  {preview.pay_with ? (
                    <img
                      src={preview.pay_with}
                      className="h-24 w-full object-contain rounded-lg border bg-gray-50 p-2"
                    />
                  ) : (
                    <div className="h-24 w-full flex items-center justify-center rounded-lg border border-dashed text-xs text-gray-400">
                      No Image
                    </div>
                  )}
                </div>

                {/* Upload Input */}
                <div className="flex-1">
                  <Label className="text-xs text-gray-500 mb-1 block">
                    Upload Payment Logo
                  </Label>
                  <Input
                    type="file"
                    onChange={(e) => handleImageChange(e, "pay_with")}
                    className="cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* ================= Delivery Section ================= */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-500" />
                <h3 className="text-sm font-medium text-gray-700">
                  Delivery Configuration
                </h3>
              </div>

              <div className="ml-auto flex items-center gap-2">
                <Label className="text-lg text-gray-500">
                  Shipping Charge Off
                </Label>

                <Controller
                  control={control}
                  name="is_shipping_charge_off"
                  render={({ field }) => (
                    <Switch
                      size="lg"
                      checked={!!field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>
              {!isShippingChargeOff && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Inside Dhaka */}
                  <div className="p-4 rounded-xl border bg-gray-50 space-y-3">
                    <h4 className="text-sm font-semibold text-gray-600">
                      Inside Dhaka
                    </h4>

                    <div className="space-y-1">
                      <Label>Delivery Charge</Label>
                      <Input
                        type="number"
                        {...register("inside_dhaka_delivery_charge")}
                        placeholder="e.g. 60"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label>Delivery Days</Label>
                      <Input
                        {...register("inside_dhaka_delivery_days")}
                        placeholder="e.g. 1-2 days"
                      />
                    </div>
                  </div>

                  {/* Outside Dhaka */}
                  <div className="p-4 rounded-xl border bg-gray-50 space-y-3">
                    <h4 className="text-sm font-semibold text-gray-600">
                      Outside Dhaka
                    </h4>

                    <div className="space-y-1">
                      <Label>Delivery Charge</Label>
                      <Input
                        type="number"
                        {...register("outside_dhaka_delivery_charge")}
                        placeholder="e.g. 120"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label>Delivery Days</Label>
                      <Input
                        {...register("outside_dhaka_delivery_days")}
                        placeholder="e.g. 3-5 days"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {can("admin_setting_create_update") && (
          <div className="flex justify-end mt-4">
            <Button disabled={isPending} onClick={handleSubmit(onSubmit)}>
              {isPending ? "Updating..." : "Update"}
            </Button>
          </div>
        )}
      </form>

      <StatusModal
        open={modal.open}
        status={modal.status}
        title={modal.title}
        message={modal.message}
        onClose={() => setModal((prev: any) => ({ ...prev, open: false }))}
      />
    </section>
  );
};

export default Setting;
