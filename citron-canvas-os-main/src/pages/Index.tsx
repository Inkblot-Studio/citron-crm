import { AppLayout } from "../components/layout/AppLayout";
import { CommandCanvas } from "../components/ai/CommandCanvas";

const Index = () => {
  return (
    <AppLayout showRightPanel>
      <CommandCanvas />
    </AppLayout>
  );
};

export default Index;
