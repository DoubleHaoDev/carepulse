"use client"

import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod";
import {Form, FormControl} from "@/components/ui/form"
import CustomFormField from "@/components/CustomFormField";
import SubmitButton from "@/components/SubmitButton";
import {useState} from "react";
import {PatientFormValidation} from "@/lib/validation";
import {useRouter} from "next/navigation";
import {registerPatient} from "@/lib/actions/patient.actions";
import {FormFieldType} from "@/components/forms/PatientForm";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Doctors, GenderOptions, IdentificationTypes, PatientFormDefaultValues} from "@/constants";
import {Label} from "@/components/ui/label";
import {SelectItem} from "@/components/ui/select";
import Image from 'next/image';
import FileUploader from "@/components/FileUploader";

const RegisterFrom = ({user}: { user: User }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof PatientFormValidation>>({
        resolver: zodResolver(PatientFormValidation),
        defaultValues: {
            ...PatientFormDefaultValues,
            name: "",
            email: "",
            phone: ""
        },
    })

    async function onSubmit(values: z.infer<typeof PatientFormValidation>) {
        setIsLoading(true);
        let formData;
        if (values.identificationDocument && values.identificationDocument.length > 0) {
            const blobFile = new Blob([values.identificationDocument[0]], {type: values.identificationDocument[0].type});
            formData = new FormData();
            formData.append("blobFile", blobFile);
            formData.append("fileName", values.identificationDocument[0].name);
        }

        try {
            const patientData = {
                userId: user.$id,
                birthDate: new Date(values.birthDate),
                identificationDocument: values.identificationDocument ? formData : undefined,
                name: values.name,
                email: values.email,
                phone: values.phone,
                gender: values.gender,
                address: values.address,
                occupation: values.occupation,
                emergencyContactName: values.emergencyContactName,
                emergencyContactNumber: values.emergencyContactNumber,
                primaryPhysician: values.primaryPhysician,
                insuranceProvider: values.insuranceProvider,
                insurancePolicyNumber: values.insurancePolicyNumber,
                allergies: values.allergies,
                currentMedication: values.currentMedication,
                familyMedicalHistory: values.familyMedicalHistory,
                pastMedicalHistory: values.pastMedicalHistory,
                identificationType: values.identificationType,
                identificationNumber: values.identificationNumber,
                privacyConsent: values.privacyConsent,
            }

            const patient = await registerPatient(patientData);
            if (patient) {
                router.push(`/patients/${user.$id}/new-appointment`)
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-12 flex-1">
                <section className="space-y-4">
                    <h1 className="header">Welcome</h1>
                    <p className="text-dark-700">Let us know more about yourself</p>
                </section>
                <section className="space-y-6">
                    <div className="mb-9 space-y-1">
                        <h2 className="sub-header">Personal Information</h2>
                    </div>
                </section>
                <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="name"
                    label="Full name"
                    placeholder="John Doe"
                    iconSrc="/assets/icons/user.svg"
                    iconAlt="user"
                />

                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        control={form.control}
                        name="email"
                        label="Email"
                        placeholder="johndoe@gmail.com"
                        iconSrc="/assets/icons/email.svg"
                        iconAlt="email"
                    />
                    <CustomFormField
                        fieldType={FormFieldType.PHONE_INPUT}
                        control={form.control}
                        name="phone"
                        label="phone number"
                        placeholder="(604)789-1012"
                    />
                </div>
                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField
                        fieldType={FormFieldType.DATE_PICKER}
                        control={form.control}
                        name="birthDate"
                        label="Date of Birth"
                    />
                    <CustomFormField
                        fieldType={FormFieldType.SKELETON}
                        control={form.control}
                        name="gender"
                        label="Gender"
                        renderSkeleton={(field) => (
                            <FormControl>
                                <RadioGroup
                                    className="flex h-11 gap-6 xl:justify-between"
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    {GenderOptions.map((option) => (
                                        <div
                                            key={option}
                                            className="radio-group"
                                        >
                                            <RadioGroupItem value={option} id={option}/>
                                            <Label htmlFor={option} className="cursor-pointer">
                                                {option}
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </FormControl>
                        )}
                    />
                </div>
                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        control={form.control}
                        name="address"
                        label="Address"
                        placeholder="309 Lougheed Hwy, Vancouver"
                    />
                    <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        control={form.control}
                        name="occupation"
                        label="Occupation"
                        placeholder="Software Engineer"
                    />
                </div>
                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        control={form.control}
                        name="emergencyContactName"
                        label="Emergency Contact Name"
                        placeholder="Gurdian's name"

                    />
                    <CustomFormField
                        fieldType={FormFieldType.PHONE_INPUT}
                        control={form.control}
                        name="emergencyContactNumber"
                        label="Emergency Contact Number"
                        placeholder="(604)789-1012"
                    />
                </div>
                <section className="space-y-6">
                    <div className="mb-9 space-y-1">
                        <h2 className="sub-header">Medical Information</h2>
                    </div>
                </section>

                <CustomFormField
                    fieldType={FormFieldType.SELECT}
                    control={form.control}
                    name="primaryPhysician"
                    label="Primary Physician"
                    placeholder="Select a physician"
                >
                    {Doctors.map((doctor) => (
                        <SelectItem key={doctor.name} value={doctor.name}>
                            <div className="flex cursor-pointer items-center gap-2">
                                <Image
                                    src={doctor.image}
                                    width={32}
                                    height={32}
                                    alt={doctor.name}
                                    className="rounded-full border border-dark-500"
                                />
                                <p>{doctor.name}</p>
                            </div>
                        </SelectItem>
                    ))}
                </CustomFormField>

                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        control={form.control}
                        name="insuranceProvider"
                        label="Insurance Provider"
                        placeholder="BlueCross BlueShield"
                    />
                    <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        control={form.control}
                        name="insurancePolicyNumber"
                        label="Insurance Policy Number"
                        placeholder="ABC123456789"
                    />
                </div>
                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField
                        fieldType={FormFieldType.TEXTAREA}
                        control={form.control}
                        name="allergies"
                        label="Allergies (if any)"
                        placeholder="Peanuts, Penicillin, Pollen"
                    />
                    <CustomFormField
                        fieldType={FormFieldType.TEXTAREA}
                        control={form.control}
                        name="currentMedication"
                        label="Current Medication (if any)"
                        placeholder="Ibuprofen 200mg, Paracetamol 500mg"
                    />
                </div>

                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField
                        fieldType={FormFieldType.TEXTAREA}
                        control={form.control}
                        name="familyMedicalHistory"
                        label="Family Medical History"
                        placeholder="Brain cancer, heart attact"
                    />
                    <CustomFormField
                        fieldType={FormFieldType.TEXTAREA}
                        control={form.control}
                        name="pastMedicalHistory"
                        label="Past Medical History"
                        placeholder="Appendectomy, Tonsillectomy"
                    />
                </div>
                <section className="space-y-6">
                    <div className="mb-9 space-y-1">
                        <h2 className="sub-header">Identification and Verification</h2>
                    </div>
                </section>

                <CustomFormField
                    fieldType={FormFieldType.SELECT}
                    control={form.control}
                    name="identificationType"
                    label="Identification Type"
                    placeholder="Select an identification type"
                >
                    {IdentificationTypes.map((idType) => (
                        <SelectItem key={idType} value={idType}>
                            {idType}
                        </SelectItem>
                    ))}
                </CustomFormField>

                <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="identificationNumber"
                    label="Identification Number"
                    placeholder="123456789"
                />
                <CustomFormField
                    fieldType={FormFieldType.SKELETON}
                    control={form.control}
                    name="identificationDocument"
                    label="Scanned copy of identification document"
                    renderSkeleton={(field) => (
                        <FormControl>
                            <FileUploader files={field.value} onChange={field.onChange}/>
                        </FormControl>
                    )}
                />
                <section className="space-y-6">
                    <div className="mb-9 space-y-1">
                        <h2 className="sub-header">Consent and Privacy</h2>
                    </div>
                </section>
                <CustomFormField
                    fieldType={FormFieldType.CHECKBOX}
                    control={form.control}
                    name="treatmentConsent"
                    label="I consent to treatment"
                />
                <CustomFormField
                    fieldType={FormFieldType.CHECKBOX}
                    control={form.control}
                    name="disclosureConsent"
                    label="I consent to disclosure of information"
                />
                <CustomFormField
                    fieldType={FormFieldType.CHECKBOX}
                    control={form.control}
                    name="privacyConsent"
                    label="I consent to privacy policy"
                />

                <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
            </form>
        </Form>
    )
}

export default RegisterFrom;
