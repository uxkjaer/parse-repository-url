'use strict';

/* eslint-disable no-unused-expressions */

const {expect} = require(`chai`);
const {describe, it} = require(`mocha`);

const parseRepositoryURL = require(`../`);

describe(`parse-repository-url`, () => {
  [
    // Short form.
    `user/project`,
  ].forEach(url => it(url, () => expect(parseRepositoryURL(url)).to.contain({
    domain: null,
    project: `project`,
    type: null,
    user: `user`,
  })));

  [
    `git@gitlab.com/really-long-group/with-really-long-sub-group/and-a-really-long-project-name.git`,
  ].forEach(url => it(url, () => {
    const parsedURL = parseRepositoryURL(url);

    expect(parsedURL).to.contain({
      domain: 'gitlab.com',
      project: `and-a-really-long-project-name`,
      type: 'gitlab',
      user: `really-long-group/with-really-long-sub-group`,
    });
  }));

  [
    // GitHub long-form.
    `https://github.com/user/project`,
    `https://github.com/user/project/`,
    `https://github.com/user/project.git`,
    `git://github.com/user/project.git`,

    // Not specifying a transport protocol.
    `git@github.com:user/project.git`,
  ].forEach(url => it(url, () => {
    const parsedURL = parseRepositoryURL(url);

    expect(parsedURL).to.contain({
      domain: 'github.com',
      project: `project`,
      type: 'github',
      user: `user`,
    });
    expect(parsedURL.browse()).to.equal(`https://github.com/user/project`);
  }));

  [
    // GitLab long-form.
    `https://gitlab.com/user/project`,
    `https://gitlab.com/user/project/`,
    `https://gitlab.com/user/project.git`,
    `git://gitlab.com/user/project.git`,

    // Not specifying a transport protocol.
    `git@gitlab.com/user/project.git`,
    `git@gitlab.com:user/project.git`,
  ].forEach(url => it(url, () => {
    const parsedURL = parseRepositoryURL(url);

    expect(parsedURL).to.contain({
      domain: 'gitlab.com',
      project: `project`,
      type: 'gitlab',
      user: `user`,
    });
    expect(parsedURL.browse()).to.equal(`https://gitlab.com/user/project`);
  }));

  [
    // GitHub long-form.
    `https://www.github.com/user/project`,
    `https://www.github.com/user/project/`,
    `http://www.github.com/user/project`,
    `http://www.github.com/user/project/`,
  ].forEach(url => it(url, () => expect(parseRepositoryURL(url)).to.contain({
    domain: 'www.github.com',
    project: `project`,
    type: 'github',
    user: `user`,
  })));

  [
    // GitLab long-form.
    `https://www.gitlab.com/user/project`,
    `https://www.gitlab.com/user/project/`,
    `http://www.gitlab.com/user/project`,
    `http://www.gitlab.com/user/project/`,
  ].forEach(url => it(url, () => expect(parseRepositoryURL(url)).to.contain({
    domain: 'www.gitlab.com',
    project: `project`,
    type: 'gitlab',
    user: `user`,
  })));

  [
    `git@git.example.com:user/project.git`,
  ].forEach(url => it(url, () => expect(parseRepositoryURL(url)).to.contain({
    domain: 'git.example.com',
    project: `project`,
    type: null,
    user: `user`,
  })));

  [
    `git@git.example.com:8080/user/project.git`,
  ].forEach(url => it(url, () => expect(parseRepositoryURL(url)).to.contain({
    domain: 'git.example.com:8080',
    project: `project`,
    type: null,
    user: `user`,
  })));

  [
    `git@git.example.net:user/project.git`,
  ].forEach(url => it(url, () => expect(parseRepositoryURL(url)).to.contain({
    domain: 'git.example.net',
    project: `project`,
    type: null,
    user: `user`,
  })));

  [
    `git@git.example.net:8080/user/project.git`,
  ].forEach(url => it(url, () => expect(parseRepositoryURL(url)).to.contain({
    domain: 'git.example.net:8080',
    project: `project`,
    type: null,
    user: `user`,
  })));

  [
    // Self-hosted GitHub.
    `https://github.example.com/user/project`,
  ].forEach(url => it(url, () => expect(parseRepositoryURL(url)).to.contain({
    domain: 'github.example.com',
    project: `project`,
    type: `github`,
    user: `user`,
  })));

  [
    // Self-hosted GitHub.
    `https://github.example.com:8080/user/project`,
  ].forEach(url => it(url, () => expect(parseRepositoryURL(url)).to.contain({
    domain: 'github.example.com:8080',
    project: `project`,
    type: `github`,
    user: `user`,
  })));

  [
    // Self-hosted GitHub.
    `https://github.example.net/user/project`,
    `https://github.example.net/user/project/`,
    `https://github.example.net/user/project.git`,
  ].forEach(url => it(url, () => expect(parseRepositoryURL(url)).to.contain({
    domain: 'github.example.net',
    project: `project`,
    type: `github`,
    user: `user`,
  })));

  [
    // Self-hosted GitHub.
    `https://www.github.example.net/user/project`,
    `https://www.github.example.net/user/project/`,
    `http://www.github.example.net/user/project`,
    `http://www.github.example.net/user/project/`,
  ].forEach(url => it(url, () => expect(parseRepositoryURL(url)).to.contain({
    domain: 'www.github.example.net',
    project: `project`,
    type: `github`,
    user: `user`,
  })));

  [
    // Self-hosted GitHub.
    `git://github.example.net/user/project.git`,
  ].forEach(url => it(url, () => expect(parseRepositoryURL(url)).to.contain({
    domain: 'github.example.net',
    project: `project`,
    type: `github`,
    user: `user`,
  })));

  [
    // Self-hosted GitLab.
    `https://gitlab.example.com/user/project`,
  ].forEach(url => it(url, () => expect(parseRepositoryURL(url)).to.contain({
    domain: 'gitlab.example.com',
    project: `project`,
    type: `gitlab`,
    user: `user`,
  })));

  [
    `https://gitlab.example.com:8080/user/project`,
  ].forEach(url => it(url, () => expect(parseRepositoryURL(url)).to.contain({
    domain: 'gitlab.example.com:8080',
    project: `project`,
    type: `gitlab`,
    user: `user`,
  })));

  [
    // Self-hosted GitLab.
    `https://gitlab.example.net/user/project`,
    `https://gitlab.example.net/user/project/`,
    `https://gitlab.example.net/user/project.git`,
  ].forEach(url => it(url, () => expect(parseRepositoryURL(url)).to.contain({
    domain: 'gitlab.example.net',
    project: `project`,
    type: `gitlab`,
    user: `user`,
  })));

  [
    // Self-hosted GitLab.
    `https://www.gitlab.example.net/user/project`,
    `https://www.gitlab.example.net/user/project/`,
    `http://www.gitlab.example.net/user/project`,
    `http://www.gitlab.example.net/user/project/`,
  ].forEach(url => it(url, () => expect(parseRepositoryURL(url)).to.contain({
    domain: 'www.gitlab.example.net',
    project: `project`,
    type: `gitlab`,
    user: `user`,
  })));

  [
    // Self-hosted GitLab.
    `git://gitlab.example.net/user/project.git`,
  ].forEach(url => it(url, () => expect(parseRepositoryURL(url)).to.contain({
    domain: 'gitlab.example.net',
    project: `project`,
    type: `gitlab`,
    user: `user`,
  })));

  [
    // Self-hosted platform of unknown type.
    `https://git.example.com/user/project`,
    `https://git.example.com/user/project.git`,
  ].forEach(url => it(url, () => expect(parseRepositoryURL(url)).to.contain({
    domain: 'git.example.com',
    project: `project`,
    type: null,
    user: `user`,
  })));

  [
    `https://git.example.com:8080/user/project.git`,
  ].forEach(url => it(url, () => expect(parseRepositoryURL(url)).to.contain({
    domain: 'git.example.com:8080',
    project: `project`,
    type: null,
    user: `user`,
  })));

  [
    // Self-hosted platform of unknown type.
    `https://git.example.net/user/project`,
    `https://git.example.net/user/project.git`,
  ].forEach(url => it(url, () => expect(parseRepositoryURL(url)).to.contain({
    domain: 'git.example.net',
    project: `project`,
    type: null,
    user: `user`,
  })));

  [
    // Self-hosted platform of unknown type where the platform name, such as `gitlab` is in the project name.
    `https://git.example.net/user/gitlab`,
    `https://git.example.net/user/gitlab.git`,
  ].forEach(url => it(url, () => expect(parseRepositoryURL(url)).to.contain({
    domain: 'git.example.net',
    project: `gitlab`,
    type: null,
    user: `user`,
  })));

  [
    // Self-hosted platform of unknown type where the platform name, such as `gitlab` is in the project name.
    `https://git.example.net/user/github`,
    `https://git.example.net/user/github.git`,
  ].forEach(url => it(url, () => expect(parseRepositoryURL(url)).to.contain({
    domain: 'git.example.net',
    project: `github`,
    type: null,
    user: `user`,
  })));

  [
    `https://git.example.net:8080/user/project.git`,
  ].forEach(url => it(url, () => expect(parseRepositoryURL(url)).to.contain({
    domain: 'git.example.net:8080',
    project: `project`,
    type: null,
    user: `user`,
  })));

  [
    // No TLD.
    `https://github/user/project`,
  ].forEach(url => it(url, () => expect(parseRepositoryURL(url)).to.contain({
    domain: 'github',
    project: `project`,
    type: `github`,
    user: `user`,
  })));

  [
    // Documentation on these URLs is available here:
    // - https://developer.github.com/v3/repos/contents/#get-archive-link

    // Tar/Zip URLs accessed through GitHub.com's official API download endpoint.
    `https://api.github.com/repos/user/project/tarball`,
    `https://api.github.com/repos/user/project/zipball`,
  ].forEach(url => it(url, () => expect(parseRepositoryURL(url)).to.contain({
    domain: 'api.github.com',
    project: `project`,
    type: `github`,
    user: `user`,
  })));

  [
    // Documentation on these URLs is available here:
    // - https://developer.github.com/v3/repos/contents/#get-archive-link

    // Tar/Zip URLs accessed through GitHub.com's unofficial download endpoint (which gets redirected to from api.github.com requests).
    `https://codeload.github.com/user/project/legacy.zip`,
    `https://codeload.github.com/user/project/legacy.tar.gz`,
  ].forEach(url => it(url, () => expect(parseRepositoryURL(url)).to.contain({
    domain: 'codeload.github.com',
    project: `project`,
    type: `github`,
    user: `user`,
  })));

  [
    // Username containing a dot and dash.
    `my.user-name/project`,
  ].forEach(url => it(url, () => expect(parseRepositoryURL(url)).to.contain({
    domain: null,
    project: `project`,
    type: null,
    user: `my.user-name`,
  })));

  [
    // Username containing a dot and dash.
    `https://github.com/my.user-name/project`,
  ].forEach(url => it(url, () => expect(parseRepositoryURL(url)).to.contain({
    domain: 'github.com',
    project: `project`,
    type: `github`,
    user: `my.user-name`,
  })));

  [
    // Project containing a dot and dash.
    `user/project.dot-dash`,
  ].forEach(url => it(url, () => expect(parseRepositoryURL(url)).to.contain({
    domain: null,
    project: `project.dot-dash`,
    type: null,
    user: `user`,
  })));

  [
    // Project containing a dot and dash.
    `https://github.com/user/project.dot-dash`,
  ].forEach(url => it(url, () => expect(parseRepositoryURL(url)).to.contain({
    domain: `github.com`,
    project: `project.dot-dash`,
    type: `github`,
    user: `user`,
  })));

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
    `git@gitlab.com/user/sub-group/project.git`,
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
    `git@gitlab.com/user/sub-group1/sub-group2/project.git`,
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
  ].forEach(url => it(url, () => expect(parseRepositoryURL(url)).to.contain({
    domain: `github.com`,
    project: null,
    type: `github`,
    user: null,
  })));

  [
    `https://github/com`,
  ].forEach(url => it(url, () => expect(parseRepositoryURL(url)).to.contain({
    domain: `github`,
    project: null,
    type: `github`,
    user: null,
  })));

  [
    `https://api.github.com`,
  ].forEach(url => it(url, () => expect(parseRepositoryURL(url)).to.contain({
    domain: `api.github.com`,
    project: null,
    type: `github`,
    user: null,
  })));

  [
    `https://codeload.github.com`,
  ].forEach(url => it(url, () => expect(parseRepositoryURL(url)).to.contain({
    domain: `codeload.github.com`,
    project: null,
    type: `github`,
    user: null,
  })));

  [
    `https://somewhere`,
  ].forEach(url => it(url, () => expect(parseRepositoryURL(url)).to.contain({
    domain: `somewhere`,
    project: null,
    type: null,
    user: null,
  })));
});
