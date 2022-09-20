FROM rishabhpoddar/supertokens_python_driver_testing
RUN cd /tmp
RUN wget https://dl.google.com/go/go1.17.linux-amd64.tar.gz
RUN tar -xvf go1.17.linux-amd64.tar.gz
RUN mv go /usr/local
env GOROOT /usr/local/go
env GOPATH $HOME/go
env PATH $GOPATH/bin:$GOROOT/bin:/user/bin:$PATH
RUN apt remove nodejs -y && rm -rf $(whereis node)
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash -
RUN apt-get install -y nodejs