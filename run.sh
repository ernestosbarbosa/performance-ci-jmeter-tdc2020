export timestamp=$(date +%Y%m%d_%H%M%S) && \
export volume_path=$(pwd) && \
export jmeter_tests_path=/opt/apache-jmeter-5.2.1/tests && \
docker run \
  -v "${volume_path}":${jmeter_tests_path} \
  jmeter \
  -n \
  -t TDC_SP_2020.jmx \
  -l report/result_${timestamp}.jtl \
  -j log/jmeter_${timestamp}.log \
  -e -o report