import { Client } from "@stomp/stompjs";
import { useEffect, useMemo } from "react";

const useWebsocket = (url) => {
  const client = useMemo(() => {
    return new Client({
      brokerURL: url,
    });
  }, [url]);

  useEffect(() => {
    client.activate();
  }, [url, client]);

  return client;
};

export default useWebsocket;
