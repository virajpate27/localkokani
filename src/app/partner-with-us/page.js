// src/app/partner-with-us/page.js
import Link from "next/link";
import { FiCheckCircle, FiArrowRight } from "react-icons/fi";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Partner With Us | Local Kokani",
  description:
    "List your hotel or restaurant on Local Kokani and reach more guests.",
}; 

export default function OldRegisterRedirect() {
  redirect("/owner/signup");
}
