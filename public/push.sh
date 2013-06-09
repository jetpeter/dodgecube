#/bin/bash

user="jetpeter"
domain="54.218.14.138"
test=false

function crawl() {
    for file in ${@}
    do
        if [ -d $file ]
        then crawl  $file"/*"
        elif [ -f $file ]
        then upload $file
        else echo "\""$file"\" is not a file or directory"
        fi
    done
}

function upload() {
    file=$1
    echo "Uploading "$file
    if ! $test; then
        scp $file $user"@"$domain:"src/dodgecube/public/"$file
    fi
}

while getopts ":t" opt; do
    case $opt in
        t)
            test=true
            ;;
        *)
            echo  "Invalid argument: -$OPTARG"
            exit 1
            ;;
    esac
done
shift $((OPTIND-1))
if [ $# -eq 0 ]
    then crawl *
else crawl $1
fi
