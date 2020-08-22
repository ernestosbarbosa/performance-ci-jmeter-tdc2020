export timestamp=$(date +%Y%m%d_%H%M%S) && \
export volume_path=$(pwd) && \
export jmeter_tests_path=/opt/apache-jmeter-5.2.1/tests && \
docker run \
  -v "${volume_path}":${jmeter_tests_path} \
  jmeter \
  -n \
  -t ${jmeter_tests_path}/TDC_SP_2020.jmx \
  -l ${jmeter_tests_path}/report/result_${timestamp}.jtl \
  -j ${jmeter_tests_path}/log/jmeter_${timestamp}.log \
  -e -o ${jmeter_tests_path}/report