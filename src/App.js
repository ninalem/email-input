import React, { useState, useRef } from "react";
import * as EmailValidator from "email-validator";
import "./styles.css";
import * as providersList from "./providers.json";

const EmailInput = (props) => {
  // spread state using hooks
  const [emailInput, setEmailInput] = useState("");

  // use useRef hook to stock the focus later
  const input = useRef(null);

  // turn the json file into an array
  const providers = Object.values(providersList).slice(0, 16);

  // select the 3 most popular providers, the list being ordered by popularity
  const popularProviders = providers.slice(0, 3);

  const handleFocus = () => {
    // stock the input to focus
    input.current.focus();
  };

  const handleChange = (event) => {
    // redefine the emailInput in the state when a change happens in the input
    setEmailInput(event.currentTarget.value);
  };

  /***
   * props = string coming from emailInput, initinially ""
   */
  const suggestionsHandler = (props) => {
    // select the part of the props following the "@"
    const includesAt = props.split("@")[1];
    // check if the mail is valid using email-validator library
    const valid = EmailValidator.validate(props);

    // if emailInput is a valid email, no suggestions are shown
    if (valid) {
      return;
    }

    /**
     * if an at is present in emailInput and something is wrote after it, show until 3 providers starting with the same characters
     * otherwise, return the 3 most popular providers
     */
    return includesAt?.length > 0
      ? providers
          .filter((provider) => provider.startsWith(includesAt))
          ?.slice(0, 3)
      : popularProviders;
  };

  // replace some part of the emailInput with the one selected
  const replaceWithSuggestion = ({ provider }) => {
    const emailInputSeparator = emailInput.split("@");
    // add the provider selected to the first part of the emailInput, and add the previously splitted at
    setEmailInput(emailInputSeparator[0] + "@" + provider);
  };

  return (
    <div id="email">
      <form>
        <input
          name="email"
          value={emailInput}
          ref={input}
          onChange={handleChange}
        />
      </form>

      <div id="suggestions">
        {suggestionsHandler(emailInput)?.map((provider, index) => {
          return (
            <p
              key={index}
              onClick={(event) => {
                replaceWithSuggestion({ provider });
                handleFocus();
              }}
            >
              @{provider}
            </p>
          );
        })}
      </div>
    </div>
  );
};

export default EmailInput;
