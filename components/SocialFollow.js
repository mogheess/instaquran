import React from "react";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faXTwitter } from "@fortawesome/free-brands-svg-icons";
config.autoAddCss = false;

export default function SocialFollow() {
  return (
    <>
      <a href="https://github.com/mogheess/instaquran" target="_blank">
        <FontAwesomeIcon className="text-pink-600" icon={faGithub} size="xl" />
      </a>
      <a href="https://x.com/mogheess_" target="_blank">
        <FontAwesomeIcon
          className="text-pink-600"
          icon={faXTwitter}
          size="xl"
        />
      </a>
    </>
  );
}
