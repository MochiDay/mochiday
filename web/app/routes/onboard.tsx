import { LoaderFunction } from "@remix-run/cloudflare";
import { Form } from "@remix-run/react";
import React from "react";
import { useState } from "react";
import { InputField } from "~/components/forms/inputField";
import { RadioField } from "~/components/forms/radioField";

export default function Onboard() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [currentCompany, setCurrentCompany] = useState("");
  const [linkedIn, setLinkedIn] = useState("");
  const [github, setGithub] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [authorization, setAuthorization] = useState("");
  const [sponsorship, setSponsorship] = useState("");

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(e.target.value);
  };
  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(e.target.value);
  };
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
  };
  const handleCurrentCompanyChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCurrentCompany(e.target.value);
  };
  const handleLinkedInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLinkedIn(e.target.value);
  };
  const handleGithubChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGithub(e.target.value);
  };
  const handlePortfolioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPortfolio(e.target.value);
  };
  const handleAuthorizationChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAuthorization(e.target.value);
  };
  const handleSponsorshipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSponsorship(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({
      firstName,
      lastName,
      email,
      phone,
      currentCompany,
      linkedIn,
      github,
      portfolio,
      authorization,
      sponsorship,
    });

    // send data to the supabase
  };

  const inputFields = [
    {
      label: "first name",
      type: "text",
      placeholder: "albert",
      required: true,
      onChange: handleFirstNameChange,
    },
    {
      label: "last name",
      type: "text",
      placeholder: "einstein",
      required: true,
      onChange: handleLastNameChange,
    },
  ];

  const radioFields = [
    {
      label: "do you have authorization to work in the US?",
      name: "authorization",
      options: ["yes", "no"],
      selectedOption: authorization,
      onChange: handleAuthorizationChange,
    },
    {
      label:
        "will you now or in the future require sponsorship for employment visa status?",
      name: "sponsorship",
      options: ["yes", "no"],
      selectedOption: sponsorship,
      onChange: handleSponsorshipChange,
    },
  ];

  return (
    <div className="min-h-fit min-w-screen bg-beige justify-center flex">
      <div className="px-10 pt-12">
        <h1 className="sm:text-4xl text-2xl font-bold text-black pb-4">
          let's get the basics right
        </h1>
        <div className="w-[70vw] h-3/6 bg-yellow border-4 border-black rounded-xl border-dashed overflow-auto">
          <div className="pl-10 pt-8">
            <Form method="post" onSubmit={handleSubmit}>
              <h2 className="text-2xl font-bold text-black pb-2">
                first name{" "}
                <span className="badge badge-error place-content-evenly text-white">
                  required
                </span>
              </h2>

              {inputFields.map((inputField) => (
                <InputField {...inputField} />
              ))}

              {/* <h2 className="text-2xl font-bold text-black pt-4 pb-2">
                last name<span className="text-red">*</span>
              </h2>
              <input
                type="text"
                className="w-7/12 h-12 border-2 bg-beige border-black rounded-3xl p-2"
                placeholder="einstein"
                required
                onChange={handleLastNameChange}
              /> */}
              <h2 className="text-2xl font-bold text-black pt-4 pb-2">
                email<span className="text-red">*</span>
              </h2>
              <input
                type="email"
                className="w-7/12 h-12 border-2 bg-beige border-black rounded-3xl p-2"
                placeholder="albert@mochiday.co"
                required
                onChange={handleEmailChange}
              />
              <h2 className="text-2xl font-bold text-black pt-4 pb-2">
                phone<span className="text-red">*</span>
              </h2>
              <input
                type="tel"
                className="w-7/12 h-12 border-2 bg-beige border-black rounded-3xl p-2"
                placeholder="123-456-7890"
                required
                onChange={handlePhoneChange}
              />
              <h2 className="text-2xl font-bold text-black pt-4 pb-2">
                current company<span className="text-red">*</span>
              </h2>
              <input
                type="text"
                className="w-7/12 h-12 border-2 bg-beige border-black rounded-3xl p-2"
                placeholder="mochiday"
                required
                onChange={handleCurrentCompanyChange}
              />
              <h2 className="text-2xl font-bold text-black pt-4 pb-2">
                linkedin<span className="text-red">*</span>
              </h2>
              <input
                type="url"
                className="w-7/12 h-12 border-2 bg-beige border-black rounded-3xl p-2"
                placeholder="https://linkedin.com/in/alberteinstein"
                required
                onChange={handleLinkedInChange}
              />
              <h2 className="text-2xl font-bold text-black pt-4 pb-2">
                github
              </h2>
              <input
                type="url"
                className="w-7/12 h-12 border-2 bg-beige border-black rounded-3xl p-2"
                placeholder="https://github.com/alberteinstein"
                onChange={handleGithubChange}
              />
              <h2 className="text-2xl font-bold text-black pt-4 pb-2">
                portfolio
              </h2>
              <input
                type="url"
                className="w-7/12 h-12 border-2 bg-beige border-black rounded-3xl p-2"
                placeholder="https://alberteinstein.com"
                onChange={handlePortfolioChange}
              />

              {radioFields.map((radioField) => (
                <RadioField {...radioField} />
              ))}

              {/* <h2 className="text-2xl font-bold text-black pt-4 pb-2">
                do you have authorization to work in the US?
                <span className="text-red">*</span>
              </h2>
              <input
                type="radio"
                id="yes"
                name="authorization"
                className="radio radio-secondary radio-md"
                value="yes"
                onChange={handleAuthorizationChange}
              />
              <label
                htmlFor="yes"
                className="text-lg font-bold text-black pr-6"
              >
                yes
              </label>
              <input
                type="radio"
                id="no"
                name="authorization"
                className="radio radio-secondary radio-md"
                value="no"
                onChange={handleAuthorizationChange}
              />
              <label htmlFor="no" className="text-lg font-bold text-black">
                no
              </label>

              <h2 className="text-2xl font-bold text-black pt-4 pb-2">
                will you now or in the future require sponsorship for employment
                visa status?
                <span className="text-red">*</span>
              </h2>
              <input
                type="radio"
                id="yes"
                name="sponsorship"
                className="radio radio-secondary radio-md"
                value="yes"
                onChange={handleSponsorshipChange}
              />
              <label
                htmlFor="yes"
                className="text-lg font-bold text-black pr-6"
              >
                yes
              </label>
              <input
                type="radio"
                id="no"
                name="sponsorship"
                className="radio radio-secondary radio-md"
                value="no"
                onChange={handleSponsorshipChange}
              />
              <label htmlFor="no" className="text-lg font-bold text-black">
                no
              </label> */}

              <div className="pt-6 pb-8 float-end px-6">
                <button
                  className="btn btn-black text-lg text-white px-8"
                  type="submit"
                >
                  lgtm
                </button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
