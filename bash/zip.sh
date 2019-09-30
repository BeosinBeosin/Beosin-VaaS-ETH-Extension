#!/bin/bash

path=$(cd $(dirname ${BASH_SOURCE[0]});pwd)
path=$(cd ${path}/..;pwd)

zip_cmd() {
	zip -q -r $1.zip $1 || exit -1
}

dirs=(Darwin Linux Windows)
pushd ${path} &> /dev/null
	for dir in ${dirs[@]}; do
		[[ -d ${dir} ]] || continue
		pushd ${dir} &> /dev/null
			echo -e "=== ${dir} ==="
			files=$(ls)
			for file in ${files[@]}; do
				if [[ -d ${file} ]] && [[ ${file} != *.zip ]]; then
					echo -e "zip ${file} ..."
					zip_cmd ${file}					
				fi
			done
		popd &> /dev/null
	done
popd &> /dev/null