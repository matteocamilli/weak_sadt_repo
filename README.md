
# WeakSATD-Action repository

This folder is part of the **WeakSATD: Detecting Weak Self-admitted Technical Debt -- Replication Package**, i.e., the anonymized replication package attached to the following submission:

"WeakSATD: Detecting Weak Self-admitted Technical Debt", Anonymous author(s), submitted to the NIER track of the 44th IEEE/ACM International Conference on Software Engineering (ICSE 2022).

## Content

* `src` folder -- implementation of the `WeakSATD` tool which leverages the [GitHub Actions](https://github.com/features/actions) platform to analyze the sources in CI/CD workflows.
* `dist/index.js` file -- main entry-point of the `WeakSATD` tool.
* `action.yml` file -- minimal working configuration file used to setup GitHub Actions.

## Quick Start

**Requirements**

* `Git` on your local machine;
* `GitHub` account;

**Instructions**

* create a local `git` repository in this folder;
* create a remote **public** repository in `GitHub` using your own `<account>` and then link it to the local one;
```
git remote add origin git@github.com:<account>/WeakSATD-Action.git
```
* commit and then push the sources;
```
git add .
git commit -m 'my first WeakSATD check in a CI/CD workflow'
git push origin master
```
* create a release that can be then referred from other repositories.
```
git tag -am 'my first release of WeakSATD-Action' v0.0.3
git push --follow-tags
```

The `WeakSATD-Action` remote repository is now ready to be used to analyze the sources of other target repositories in CI/CD workflows. Follow the instructions reported in the `target_repo/README.md` file to try out a simple demo.
