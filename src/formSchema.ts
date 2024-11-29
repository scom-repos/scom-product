import { ScomProductConfigInput } from "./configInput";

export default {
    dataSchema: {
        type: 'object',
        properties: {
            config: {
                title: 'Community',
                type: "object",
                required: true
            }
        }
    },
    uiSchema: {
        type: "VerticalLayout",
        elements: [
            {
                type: "Control",
                scope: "#/properties/config"
            },
        ]
    },
    customControls() {
        return {
            "#/properties/config": {
                render: () => {
                    const communityProductInput = new ScomProductConfigInput();
                    return communityProductInput;
                },
                getData: (control: ScomProductConfigInput) => {
                    return control.getData();
                },
                setData: async (control: ScomProductConfigInput, value: string, rowData: any) => {
                    await control.ready();
                    control.setData(rowData?.config)
                }
            }
        }
    }
}