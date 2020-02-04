package com.idm.e2e.repositories;

import com.idm.e2e.entities.VariableEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface VariableRepository extends JpaRepository<VariableEntity, Long> {

    @Query("select Variable from VariableEntity Variable join Variable.user User where User.id = ?1")
    List<VariableEntity> findAllByUser(long userID);

    @Transactional
    @Modifying
    @Query("delete from VariableEntity Variable where Variable.id = :variable_id and Variable.user.id = :user_id")
    Integer removeById(@Param("variable_id") long variableID, @Param("user_id") long userID);
}
