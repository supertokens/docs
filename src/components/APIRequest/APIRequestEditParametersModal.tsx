import { useState, useCallback, useContext, useMemo, forwardRef, ReactNode, createContext } from "react";
import { Button, Flex, Text, Heading, TextField, Separator, Dialog, Slot } from "@radix-ui/themes";
import * as Form from "@radix-ui/react-form";
import { useDocPageData } from "@site/src/hooks";
import { DOC_PAGE_STORE_DEFAULT_VALUES, docPageStore } from "@site/src/lib";
import { APIRequestContext } from "./APIRequest";
import type { OpenAPIV3 } from "@scalar/openapi-types";

type FormData = {
  apiDomain: string;
  apiBasePath: string;
  coreDomain: string;
  tenantId: string;
  appId: string;
};

type APIRequestEditParametersModalContextType = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
};

const APIRequestEditParametersModalContext = createContext<APIRequestEditParametersModalContextType>(
  {} as APIRequestEditParametersModalContextType,
);

function APIRequestEditParametersModalContent({ onSuccess }: { onSuccess: (data: FormData) => void }) {
  const { apiName } = useContext(APIRequestContext);
  const { setIsOpen } = useContext(APIRequestEditParametersModalContext);

  const apiDomain = useDocPageData("apiDomain");
  const apiBasePath = useDocPageData("apiBasePath");
  const coreDomain = useDocPageData("coreDomain");
  const tenantId = useDocPageData("tenantId");
  const appId = useDocPageData("appId");

  const [formValues, setFormValues] = useState({
    apiDomain: apiDomain === DOC_PAGE_STORE_DEFAULT_VALUES.apiDomain ? "" : apiDomain,
    apiBasePath,
    coreDomain: coreDomain === DOC_PAGE_STORE_DEFAULT_VALUES.coreDomain ? "" : coreDomain,
    tenantId,
    appId,
  });

  const onChangeInputValue = useCallback((field: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSave = useCallback(() => {
    docPageStore.updateValue("apiDomain", formValues.apiDomain);
    docPageStore.updateValue("apiBasePath", formValues.apiBasePath);
    docPageStore.updateValue("coreDomain", formValues.coreDomain);
    docPageStore.updateValue("tenantId", formValues.tenantId);
    docPageStore.updateValue("appId", formValues.appId);

    onSuccess(formValues);
  }, [formValues, onSuccess]);

  const onKeyDown = useCallback(
    (e) => {
      if (e.key === "/") {
        // Prevent triggering the search modal
        e.stopPropagation();
      }

      if (e.key === "Enter") {
        handleSave();
        setIsOpen(false);
      }
    },
    [handleSave],
  );

  const handleCancel = useCallback(() => {
    setFormValues({
      apiDomain,
      apiBasePath,
      coreDomain,
      tenantId,
      appId,
    });
  }, [apiDomain, apiBasePath, coreDomain, tenantId, appId]);

  const isSubmitDisabled = useMemo(() => {
    if (apiName === "fdi") {
      return !formValues.apiDomain || !formValues.apiBasePath || !formValues.tenantId || !formValues.appId;
    }
    return !formValues.coreDomain || !formValues.tenantId || !formValues.appId;
  }, [formValues]);

  return (
    <Dialog.Content maxWidth="450px">
      <Form.Root onKeyDown={onKeyDown}>
        <Flex direction="column">
          <Flex justify="between" align="center">
            <Dialog.Title>Edit Server Configuration</Dialog.Title>
          </Flex>

          <Dialog.Description>
            <Text color="gray" size="2">
              Setup the server parameters in order to test the API examples.
            </Text>
          </Dialog.Description>

          <Flex direction="column" gap="3">
            {apiName === "fdi" && (
              <Form.Field name="apiDomain">
                <Flex gap="1" direction="column">
                  <Form.Label>
                    <Text weight="bold" size="2">
                      Backend API Domain
                    </Text>
                  </Form.Label>
                  <Form.Control asChild>
                    <TextField.Root
                      size="2"
                      placeholder="The address of your backend server"
                      value={formValues.apiDomain}
                      onChange={(e) => onChangeInputValue("apiDomain", e.target.value)}
                    />
                  </Form.Control>
                </Flex>
              </Form.Field>
            )}

            {apiName === "fdi" && (
              <Form.Field name="apiBasePath">
                <Flex gap="1" direction="column">
                  <Form.Label>
                    <Text weight="bold" size="2">
                      API Base Path
                    </Text>
                  </Form.Label>
                  <Form.Control asChild>
                    <TextField.Root
                      size="2"
                      placeholder="The api base path used in the backend SDK configuration"
                      value={formValues.apiBasePath}
                      onChange={(e) => onChangeInputValue("apiBasePath", e.target.value)}
                    />
                  </Form.Control>
                </Flex>
              </Form.Field>
            )}

            {apiName === "cdi" && (
              <Form.Field name="coreDomain">
                <Flex gap="1" direction="column">
                  <Form.Label>
                    <Text weight="bold" size="2">
                      Core Domain
                    </Text>
                  </Form.Label>
                  <Form.Control asChild>
                    <TextField.Root
                      size="2"
                      placeholder="The address of the SuperTokens Core Service"
                      value={formValues.coreDomain}
                      onChange={(e) => onChangeInputValue("coreDomain", e.target.value)}
                    />
                  </Form.Control>
                </Flex>
              </Form.Field>
            )}

            <Form.Field name="tenantId">
              <Flex gap="1" direction="column">
                <Form.Label>
                  <Text weight="bold" size="2">
                    Tenant ID
                  </Text>
                </Form.Label>
                <Form.Control asChild>
                  <TextField.Root
                    size="2"
                    placeholder="The ID of the tenant you want to use"
                    value={formValues.tenantId}
                    onChange={(e) => onChangeInputValue("tenantId", e.target.value)}
                  />
                </Form.Control>
              </Flex>
            </Form.Field>

            <Form.Field name="appId">
              <Flex gap="1" direction="column">
                <Form.Label>
                  <Text weight="bold" size="2">
                    App ID
                  </Text>
                </Form.Label>
                <Form.Control asChild>
                  <TextField.Root
                    size="2"
                    placeholder="The ID of the app you want to use"
                    value={formValues.appId}
                    onChange={(e) => onChangeInputValue("appId", e.target.value)}
                  />
                </Form.Control>
              </Flex>
            </Form.Field>
          </Flex>

          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray" size="2" onClick={handleCancel}>
                Cancel
              </Button>
            </Dialog.Close>
            <Dialog.Close>
              <Button size="2" onClick={handleSave} disabled={isSubmitDisabled}>
                Save
              </Button>
            </Dialog.Close>
          </Flex>
        </Flex>
      </Form.Root>
    </Dialog.Content>
  );
}

const APIRequestEditParametersModalRoot = ({
  children,
  onSuccess,
}: {
  children: ReactNode;
  onSuccess: (data: FormData) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <APIRequestEditParametersModalContext.Provider value={{ isOpen, setIsOpen }}>
      <Dialog.Root onOpenChange={setIsOpen} open={isOpen}>
        {children}
        <APIRequestEditParametersModalContent onSuccess={onSuccess} />
      </Dialog.Root>
    </APIRequestEditParametersModalContext.Provider>
  );
};

const APIRequestEditParametersModalTrigger = function APIRequestEditParametersModalTrigger(props) {
  const { children } = props;
  const { setIsOpen } = useContext(APIRequestEditParametersModalContext);

  return <Slot onClick={() => setIsOpen(true)}>{children}</Slot>;
};

export const APIRequestEditParametersModal = {
  Root: APIRequestEditParametersModalRoot,
  Trigger: APIRequestEditParametersModalTrigger,
};
