package com.idm.e2e.repositories;

import com.idm.e2e.entities.NodeLogEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface NodeLogRepository extends JpaRepository<NodeLogEntity, Long> {
    @Transactional
    @Modifying
    @Query("delete from NodeLogEntity Log where Log.node.id = :node_id")
    void deleteByNodeId(@Param("node_id") long nodeId);
}
