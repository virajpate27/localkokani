// src/app/partner-with-us/page.js
import Link from "next/link";
import { FiCheckCircle, FiArrowRight } from "react-icons/fi";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Partner With Us | StayFinder",
  description:
    "List your hotel or restaurant on StayFinder and reach more guests.",
};

export default function OldRegisterRedirect() {
  redirect("/owner/signup");
}
