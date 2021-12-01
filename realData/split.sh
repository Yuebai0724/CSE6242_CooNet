#!/bin/bash
FILENAME=database.csv
HDR=$(head -1 $FILENAME)
split -l 50000 $FILENAME xyz
n=1
for f in xyz*
do
     if [ $n -gt 1 ]; then 
          echo $HDR > Part${n}.csv
     fi
     cat $f >> Part${n}.csv
     rm $f
     ((n++))
done