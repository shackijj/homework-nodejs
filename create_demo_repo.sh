#!/bin/sh

git clone https://github.com/libgit2/libgit2
cd libgit2
for remote in `git branch -r | grep -v /HEAD`; do git checkout --track $remote ; done