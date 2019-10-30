#!/bin/bash

path=$(cd $(dirname ${BASH_SOURCE[0]});pwd)
path=$(cd ${path}/..;pwd)

unzip_cmd() {
	unzip -q -o $1 || exit -1
}

dirs=(Darwin Linux Windows)
pushd ${path} &> /dev/null
	for dir in ${dirs[@]}; do
		[[ -d ${dir} ]] || continue
		pushd ${dir} &> /dev/null
			echo -e "=== ${dir} ==="
			files=$(ls)
			for file in ${files[@]}; do
				if [[ -f ${file} ]] && [[ ${file} == *.zip ]]; then
					echo -e "unzip ${file} ..."
					unzip_cmd ${file}					
				fi
			done
		popd &> /dev/null
	done
popd &> /dev/null