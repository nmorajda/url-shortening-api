#!/bin/bash
for F in *.jpg; do cwebp $F -o `basename ${F%.jpg}`.webp; done
for F in *.png; do cwebp $F -o `basename ${F%.png}`.webp; done
