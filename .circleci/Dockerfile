FROM rishabhpoddar/supertokens_python_driver_testing
RUN cd /tmp
RUN wget https://dl.google.com/go/go1.17.linux-amd64.tar.gz
RUN tar -xvf go1.17.linux-amd64.tar.gz
RUN mv go /usr/local
env GOROOT /usr/local/go
env GOPATH $HOME/go
env PATH $GOPATH/bin:$GOROOT/bin:$PATH
RUN curl -fsSL https://deb.nodesource.com/setup_14.x | bash -
RUN apt-get install -y nodejs