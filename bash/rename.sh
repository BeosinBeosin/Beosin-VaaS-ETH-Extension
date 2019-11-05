#!/bin/bash

files=$(ls)
for file in ${files[@]}; do
	if [[ -f ${file} ]] && [[ ${file} == 0.* ]] && [[ ${file} == *.zip ]]; then
		mv ${file} "solc-${file}"
	fi
done