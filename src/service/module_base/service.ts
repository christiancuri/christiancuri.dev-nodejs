import {} from "@models";
import {} from "@utils";

export async function example({
  props,
}: {
  props: string;
}): Promise<{ example: boolean; props: string }> {
  return { example: true, props };
}
