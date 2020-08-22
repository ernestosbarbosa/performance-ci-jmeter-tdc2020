FROM alpine:3.6

ARG JMETER_VERSION="5.2.1"

ENV JMETER_HOME /opt/apache-jmeter-${JMETER_VERSION}
ENV JMETER_BIN  ${JMETER_HOME}/bin
ENV MIRROR_HOST http://mirrors.ocf.berkeley.edu/apache/jmeter
ENV JMETER_DOWNLOAD_URL ${MIRROR_HOST}/binaries/apache-jmeter-${JMETER_VERSION}.tgz

RUN    apk update \
	&& apk upgrade \
	&& apk add ca-certificates \
	&& update-ca-certificates

RUN apk add --update openjdk8-jre tzdata curl unzip bash \
            && cp /usr/share/zoneinfo/America/Sao_Paulo /etc/localtime \
            && echo "America/Sao_Paulo" >  /etc/timezone \
	&& rm -rf /var/cache/apk/* \
	&& mkdir -p /tmp/dependencies  \
	&& curl -L ${JMETER_DOWNLOAD_URL} >  /tmp/dependencies/apache-jmeter-${JMETER_VERSION}.tgz  \
	&& mkdir -p /opt  \
	&& tar -xzf /tmp/dependencies/apache-jmeter-${JMETER_VERSION}.tgz -C /opt  \
	&& rm -rf /tmp/dependencies

RUN apk add --no-cache nss

ENV PATH $PATH:$JMETER_BIN

COPY TDC_SP_2020.jmx TDC_SP_2020.jmx

COPY launch.sh /

RUN ["chmod", "+x", "/launch.sh"]

ENTRYPOINT ["/launch.sh"]