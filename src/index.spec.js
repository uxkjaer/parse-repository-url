'use strict';

/* eslint-disable no-unused-expressions */

const {expect} = require(`chai`);
const {describe, it} = require(`mocha`);

const parseRepositoryURL = require(`../`);

describe(`parse-repository-url`, () => {
  [
    // Short form.
    `user/project`,

    // GitHub long-form.
    `https://github.com/user/project`,
    `https://github.com/user/project/`,
    `https://github.com/user/project.git`,
    `https://www.github.com/user/project`,
    `https://www.github.com/user/project/`,
    `http://www.github.com/user/project`,
    `http://www.github.com/user/project/`,
    `git://github.com/user/project.git`,

    // GitLab long-form.
    `https://gitlab.com/user/project`,
    `https://gitlab.com/user/project/`,
    `https://gitlab.com/user/project.git`,
    `https://www.gitlab.com/user/project`,
    `https://www.gitlab.com/user/project/`,
    `http://www.gitlab.com/user/project`,
    `http://www.gitlab.com/user/project/`,
    `git://gitlab.com/user/project.git`,

    // Not specifying a transport protocol.
    `git@github.com:user/project.git`,
    `git@gitlab.com:user/project.git`,
    `git@git.example.com:user/project.git`,
    `git@git.example.net:user/project.git`,
    `git@git.example.com:8080/user/project.git`,
    `git@git.example.net:8080/user/project.git`,

    // Self-hosted GitHub.
    `https://github.example.com/user/project`,
    `https://github.example.com:8080/user/project`,
    `https://github.example.net/user/project`,
    `https://github.example.net/user/project/`,
    `https://github.example.net/user/project.git`,
    `https://www.github.example.net/user/project`,
    `https://www.github.example.net/user/project/`,
    `http://www.github.example.net/user/project`,
    `http://www.github.example.net/user/project/`,
    `git://github.example.net/user/project.git`,

    // Self-hosted GitLab.
    `https://gitlab.example.com/user/project`,
    `https://gitlab.example.com:8080/user/project`,
    `https://gitlab.example.net/user/project`,
    `https://gitlab.example.net/user/project/`,
    `https://gitlab.example.net/user/project.git`,
    `https://www.gitlab.example.net/user/project`,
    `https://www.gitlab.example.net/user/project/`,
    `http://www.gitlab.example.net/user/project`,
    `http://www.gitlab.example.net/user/project/`,
    `git://gitlab.example.net/user/project.git`,

    // Self-hosted platform of unknown type.
    `https://git.example.com/user/project`,
    `https://git.example.net/user/project`,
    `https://git.example.com/user/project.git`,
    `https://git.example.net/user/project.git`,
    `https://git.example.com:8080/user/project.git`,
    `https://git.example.net:8080/user/project.git`,

    // No TLD.
    `https://github/user/project`,

    // Documentation on these URLs is available here:
    // - https://developer.github.com/v3/repos/contents/#get-archive-link

    // Tar/Zip URLs accessed through GitHub.com's official API download endpoint.
    `https://api.github.com/repos/user/project/tarball`,
    `https://api.github.com/repos/user/project/zipball`,

    // Tar/Zip URLs accessed through GitHub.com's unofficial download endpoint (which gets redirected to from api.github.com requests).
    `https://codeload.github.com/user/project/legacy.zip`,
    `https://codeload.github.com/user/project/legacy.tar.gz`,
  ].forEach(url => it(url, () => expect(parseRepositoryURL(url)).to.contain({user: `user`, project: `project`})));

  // Username containing a dot and dash.
  [
    `my.user-name/project`,
    `https://github.com/my.user-name/project`,
  ].forEach(url => it(url, () => expect(parseRepositoryURL(url)).to.contain({user: `my.user-name`, project: `project`})));

  // Project containing a dot and dash.
  [
    `user/project.dot-dash`,
    `https://github.com/user/project.dot-dash`,
  ].forEach(url => it(url, () => expect(parseRepositoryURL(url)).to.contain({user: `user`, project: `project.dot-dash`})));

  [
    // GitLab with single sub-group.
    `https://gitlab.com/user/sub-group/project`,
    `https://gitlab.example.com/user/sub-group/project`,
    `https://gitlab.example.net/user/sub-group/project`,
    `https://gitlab.example.net/user/sub-group/project/`,
    `https://gitlab.example.net/user/sub-group/project.git`,
    `https://www.gitlab.example.net/user/sub-group/project`,
    `https://www.gitlab.example.net/user/sub-group/project/`,
    `http://www.gitlab.example.net/user/sub-group/project`,
    `http://www.gitlab.example.net/user/sub-group/project/`,
    `git://gitlab.example.net/user/sub-group/project.git`,

    // Not specifying a transport protocol.
    `git@gitlab.com:user/sub-group/project.git`,
    `git@gitlab.example.com:user/sub-group/project.git`,
    `git@gitlab.example.net:user/sub-group/project.git`,

    // Self-hosted platform of unknown type containing a single sub-group.
    `https://git.example.com/user/sub-group/project`,
    `https://git.example.net/user/sub-group/project`,
    `https://git.example.com/user/sub-group/project.git`,
    `https://git.example.net/user/sub-group/project.git`,
  ].forEach(url => it(url, () => expect(parseRepositoryURL(url)).to.contain({user: `user/sub-group`, project: `project`})));

  [
    // GitLab with multiple sub-groups.
    `https://gitlab.com/user/sub-group1/sub-group2/project`,
    `https://gitlab.example.com/user/sub-group1/sub-group2/project`,
    `https://gitlab.example.net/user/sub-group1/sub-group2/project`,
    `https://gitlab.example.net/user/sub-group1/sub-group2/project/`,
    `https://gitlab.example.net/user/sub-group1/sub-group2/project.git`,
    `https://www.gitlab.example.net/user/sub-group1/sub-group2/project`,
    `https://www.gitlab.example.net/user/sub-group1/sub-group2/project/`,
    `http://www.gitlab.example.net/user/sub-group1/sub-group2/project`,
    `http://www.gitlab.example.net/user/sub-group1/sub-group2/project/`,
    `git://gitlab.example.net/user/sub-group1/sub-group2/project.git`,

    // Not specifying a transport protocol.
    `git@gitlab.com:user/sub-group1/sub-group2/project.git`,
    `git@gitlab.example.com:user/sub-group1/sub-group2/project.git`,
    `git@gitlab.example.net:user/sub-group1/sub-group2/project.git`,

    // Self-hosted platform of unknown type containing a single sub-group.
    `https://git.example.com/user/sub-group1/sub-group2/project`,
    `https://git.example.net/user/sub-group1/sub-group2/project`,
    `https://git.example.com/user/sub-group1/sub-group2/project.git`,
    `https://git.example.net/user/sub-group1/sub-group2/project.git`,
  ].forEach(url => it(url, () => expect(parseRepositoryURL(url)).to.contain({user: `user/sub-group1/sub-group2`, project: `project`})));

  [
    // Invalid URLs.
    `https://github.com`,
    `https://github.com/user`,
    `https://github/com`,
    `https://api.github.com`,
    `https://codeload.github.com`,
    `https://somewhere`,
  ].forEach(url => it(url, () => expect(parseRepositoryURL(url)).to.be.null));
});
