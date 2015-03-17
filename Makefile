PACKAGE_NAME = tb-bug766495

all: xpi

copy-extlib:
	cp extlib/**/prefs.js modules/lib/

xpi: buildscript/makexpi.sh copy-extlib
	cp buildscript/makexpi.sh ./
	./makexpi.sh -n $(PACKAGE_NAME) -o
	rm ./makexpi.sh

buildscript/makexpi.sh:
	git submodule update --init
