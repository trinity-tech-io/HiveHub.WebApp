import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stack } from '@mui/material';
import { PageTitleTypo } from '../../../components/CustomTypos';
import NodeItem from '../../../components/NodeItem';
import { useUserContext } from '../../../contexts/UserContext';
import { getHiveNodesList } from '../../../service/fetch';
import { emptyNodeItem } from '../../../utils/filler';
import { PlusButton } from '../../../components/CustomButtons';

export default function HiveNodes() {
  const navigate = useNavigate();
  const { user } = useUserContext();
  const [loading, setLoading] = useState(false);
  const [myNodeList, setMyNodeList] = useState(Array(2).fill(emptyNodeItem));

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const nodeList = await getHiveNodesList(undefined, user.did, false, true, false);
      setMyNodeList(nodeList);
      setLoading(false);
    };
    fetchData();
  }, [user.did]);

  return (
    <>
      <PageTitleTypo mt={{ xs: 5, md: 6 }} mb={myNodeList.length ? 0 : 1.25}>
        My Nodes
      </PageTitleTypo>
      <Stack mt={{ xs: 4, md: 8 }} mb={5} spacing={{ xs: 3.75, md: 6.25 }}>
        {myNodeList.map((node, index) => (
          <NodeItem
            key={index}
            id={node.nid}
            name={node.name}
            status={node.status}
            time={node.created}
            description={node.remark}
            ip={node.ip}
            did={node.owner_did}
            ownerName={node.ownerName}
            isMyNode
            isLoading={loading}
            sx={{ cursor: 'pointer' }}
          />
        ))}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3.75, md: 6.25 }}>
          <PlusButton onClick={() => navigate('/dashboard/nodes/envconfig')}>
            Create Hive Node Config
          </PlusButton>
          <PlusButton onClick={() => navigate('/dashboard/nodes/create')}>
            Create Hive Node
          </PlusButton>
        </Stack>
      </Stack>
    </>
  );
}
